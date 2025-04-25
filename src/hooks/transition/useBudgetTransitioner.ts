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
          
          case "partial":
            // Conserver une partie du budget
            if (typeof envelope.partialAmount === 'number') {
              await updateBudgetSpent(envelope.id, envelope.partialAmount);
              console.log(`Budget ${envelope.title} partiellement conservé (spent = ${envelope.partialAmount})`);
            }
            break;
          
          case "transfer":
            // Transférer le budget vers une autre enveloppe
            if (envelope.transferTargetId) {
              await transferBudget(
                envelope.id, 
                envelope.transferTargetId, 
                budgetToProcess.budget - budgetToProcess.spent,
                dashboardId
              );
              console.log(`Budget ${envelope.title} transféré vers ${envelope.transferTargetId}`);
            }
            break;
          
          case "multi-transfer":
            // Transferts multiples vers plusieurs enveloppes
            if (envelope.multiTransfers && envelope.multiTransfers.length > 0) {
              await processMultiTransfers(
                envelope.id, 
                envelope.multiTransfers, 
                budgetToProcess.budget - budgetToProcess.spent,
                dashboardId
              );
              console.log(`Budget ${envelope.title} transféré vers plusieurs cibles`);
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
      
      // Ajouter le montant au budget cible
      const newSpent = Math.max(0, target.spent - amount);
      await db.updateBudget({
        ...target,
        spent: newSpent
      });
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
          const newSpent = Math.max(0, target.spent - transferAmount);
          
          await db.updateBudget({
            ...target,
            spent: newSpent
          });
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
