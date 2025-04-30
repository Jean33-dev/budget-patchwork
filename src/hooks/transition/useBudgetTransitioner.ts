
import { db } from "@/services/database";
import { TransitionEnvelope, TransitionOption, MultiTransfer } from "@/types/transition";
import { toast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";

export const useBudgetTransitioner = () => {
  const processEnvelopeTransitions = async (envelopes: TransitionEnvelope[], dashboardId: string) => {
    console.log(`Traitement de la transition des enveloppes pour le dashboard: ${dashboardId}`);
    
    // Récupérer tous les budgets du dashboard
    const allBudgets = await db.getBudgets();
    const dashboardBudgets = allBudgets.filter(budget => 
      String(budget.dashboardId) === String(dashboardId)
    );
    
    console.log(`Budgets trouvés pour le dashboard ${dashboardId}: ${dashboardBudgets.length}`);
    
    // Traiter chaque enveloppe
    for (const envelope of envelopes) {
      // Vérifier que l'enveloppe appartient au dashboard courant
      const budgetToProcess = dashboardBudgets.find(b => b.id === envelope.id);
      if (!budgetToProcess) {
        console.log(`Budget ${envelope.id} ignoré car il n'appartient pas au dashboard ${dashboardId}`);
        continue;
      }
      
      console.log(`Traitement de l'enveloppe ${envelope.id} (${envelope.title}) - Option: ${envelope.transitionOption}`);
      
      try {
        switch (envelope.transitionOption) {
          case "keep":
            // Ne rien faire, garder le budget tel quel
            console.log(`Budget ${envelope.title} conservé tel quel`);
            break;
          
          case "reset":
            // Réinitialiser le budget (mettre spent à 0)
            await updateBudgetSpent(envelope.id, 0);
            console.log(`Budget ${envelope.title} réinitialisé (spent = 0)`);
            break;
          
          case "carry":
            // Reporter le montant non dépensé
            const remainingAmount = budgetToProcess.budget + (budgetToProcess.carriedOver || 0) - budgetToProcess.spent;
            if (remainingAmount > 0) {
              // Mise à jour du budget avec le montant reporté
              await updateBudgetCarriedOver(envelope.id, remainingAmount);
              console.log(`Budget ${envelope.title} : ${remainingAmount} reporté au mois suivant (ancien solde: ${budgetToProcess.budget + (budgetToProcess.carriedOver || 0) - budgetToProcess.spent})`);
            } else {
              console.log(`Budget ${envelope.title} : rien à reporter (montant restant ≤ 0)`);
            }
            // Réinitialiser quand même le 'spent'
            await updateBudgetSpent(envelope.id, 0);
            break;
          
          case "partial":
            // Conserver une partie du budget
            if (typeof envelope.partialAmount === 'number') {
              // Mettre à jour le montant reporté
              await updateBudgetCarriedOver(envelope.id, envelope.partialAmount);
              // Et réinitialiser le spent
              await updateBudgetSpent(envelope.id, 0);
              console.log(`Budget ${envelope.title} partiellement reporté (${envelope.partialAmount})`);
            }
            break;
          
          case "transfer":
            // Transférer le budget vers une autre enveloppe
            if (envelope.transferTargetId) {
              const amountToTransfer = budgetToProcess.budget + (budgetToProcess.carriedOver || 0) - budgetToProcess.spent;
              await transferBudget(
                envelope.id, 
                envelope.transferTargetId, 
                amountToTransfer,
                dashboardId
              );
              console.log(`Budget ${envelope.title} transféré vers ${envelope.transferTargetId} (montant: ${amountToTransfer})`);
            }
            break;
          
          case "multi-transfer":
            // Transferts multiples vers plusieurs enveloppes
            if (envelope.multiTransfers && envelope.multiTransfers.length > 0) {
              const amountToDistribute = budgetToProcess.budget + (budgetToProcess.carriedOver || 0) - budgetToProcess.spent;
              await processMultiTransfers(
                envelope.id, 
                envelope.multiTransfers, 
                amountToDistribute,
                dashboardId
              );
              console.log(`Budget ${envelope.title} transféré vers plusieurs cibles (montant total: ${amountToDistribute})`);
            }
            break;
            
          default:
            console.log(`Option de transition non reconnue pour ${envelope.title}: ${envelope.transitionOption}`);
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de l'enveloppe ${envelope.title}:`, error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de traiter le budget "${envelope.title}"`
        });
      }
    }
    
    console.log("Transition des enveloppes terminée");
  };
  
  const updateBudgetSpent = async (budgetId: string, newSpentValue: number) => {
    try {
      const budget = await db.getBudgets()
        .then(budgets => budgets.find(b => b.id === budgetId));
      
      if (budget) {
        await db.updateBudget({
          ...budget,
          spent: newSpentValue
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du budget ${budgetId}:`, error);
      throw error;
    }
  };
  
  // Fonction pour mettre à jour le montant reporté
  const updateBudgetCarriedOver = async (budgetId: string, carriedOverAmount: number) => {
    try {
      const budget = await db.getBudgets()
        .then(budgets => budgets.find(b => b.id === budgetId));
      
      if (budget) {
        console.log(`Budget ${budget.title}: Remplacement du montant reporté ${budget.carriedOver || 0} par ${carriedOverAmount}`);
        
        await db.updateBudget({
          ...budget,
          carriedOver: carriedOverAmount // Remplacer le montant reporté au lieu de l'additionner
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du montant reporté pour le budget ${budgetId}:`, error);
      throw error;
    }
  };
  
  const transferBudget = async (sourceId: string, targetId: string, amount: number, dashboardId: string) => {
    try {
      const budgets = await db.getBudgets();
      
      // S'assurer que les budgets appartiennent au dashboard actuel
      const source = budgets.find(b => b.id === sourceId && String(b.dashboardId) === String(dashboardId));
      const target = budgets.find(b => b.id === targetId && String(b.dashboardId) === String(dashboardId));
      
      if (!source || !target) {
        throw new Error("Budgets source ou cible introuvables ou n'appartiennent pas au dashboard actuel");
      }
      
      // Réinitialiser le budget source (spent = 0)
      await db.updateBudget({
        ...source,
        spent: 0
      });
      
      // Ajouter le montant au montant reporté du budget cible
      const newCarriedOver = (target.carriedOver || 0) + amount;
      await db.updateBudget({
        ...target,
        carriedOver: newCarriedOver
      });
      
      console.log(`Transfert de ${amount} depuis ${source.title} vers ${target.title} (nouveau report: ${newCarriedOver})`);
    } catch (error) {
      console.error(`Erreur lors du transfert du budget ${sourceId} vers ${targetId}:`, error);
      throw error;
    }
  };
  
  const processMultiTransfers = async (sourceId: string, transfers: MultiTransfer[], totalAmount: number, dashboardId: string) => {
    try {
      const budgets = await db.getBudgets();
      const source = budgets.find(b => b.id === sourceId && String(b.dashboardId) === String(dashboardId));
      
      if (!source) {
        throw new Error("Budget source introuvable ou n'appartient pas au dashboard actuel");
      }
      
      // Réinitialiser le budget source
      await db.updateBudget({
        ...source,
        spent: 0
      });
      
      // Traiter chaque transfert
      for (const transfer of transfers) {
        const target = budgets.find(b => b.id === transfer.targetId && String(b.dashboardId) === String(dashboardId));
        
        if (target) {
          const transferAmount = transfer.amount || 0;
          // Ajouter le montant au report du budget cible
          const newCarriedOver = (target.carriedOver || 0) + transferAmount;
          
          await db.updateBudget({
            ...target,
            carriedOver: newCarriedOver
          });
          
          console.log(`Transfert de ${transferAmount} depuis ${source.title} vers ${target.title} (nouveau report: ${newCarriedOver})`);
        }
      }
    } catch (error) {
      console.error(`Erreur lors des transferts multiples depuis ${sourceId}:`, error);
      throw error;
    }
  };

  return {
    processEnvelopeTransitions
  };
};
