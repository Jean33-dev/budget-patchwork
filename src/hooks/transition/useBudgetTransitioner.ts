
import { db } from "@/services/database";
import { TransitionEnvelope } from "@/types/transition";

export const useBudgetTransitioner = () => {
  const processEnvelopeTransitions = async (envelopes: TransitionEnvelope[]) => {
    // Traitement des budgets pour la transition
    for (const envelope of envelopes) {
      const budget = await db.getBudgets().then(budgets => 
        budgets.find(b => b.id === envelope.id)
      );

      if (!budget) continue;

      // Calcul du montant restant : budget initial + report précédent - dépenses
      const currentRemaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
      console.log(`Transition du budget ${budget.title}:`, {
        budgetInitial: budget.budget,
        carriedOver: budget.carriedOver || 0,
        spent: budget.spent,
        remaining: currentRemaining,
        transitionOption: envelope.transitionOption
      });
      
      switch (envelope.transitionOption) {
        case "reset":
          // Réinitialise les dépenses et le report, garde le budget initial
          await db.updateBudget({
            ...budget,
            spent: 0,
            carriedOver: 0
          });
          console.log(`Reset - Nouveau budget état:`, {
            title: budget.title,
            spent: 0,
            carriedOver: 0
          });
          break;
        
        case "carry":
          // Garde le même budget mais ajoute le solde restant au report
          await db.updateBudget({
            ...budget,
            spent: 0,
            carriedOver: currentRemaining
          });
          console.log(`Report total - Nouveau budget état:`, {
            title: budget.title,
            spent: 0,
            carriedOver: currentRemaining
          });
          break;
        
        case "partial":
          // Garde le même budget mais ajoute le montant spécifié au report
          if (envelope.partialAmount !== undefined) {
            await db.updateBudget({
              ...budget,
              spent: 0,
              carriedOver: envelope.partialAmount
            });
            console.log(`Report partiel - Nouveau budget état:`, {
              title: budget.title,
              spent: 0,
              carriedOver: envelope.partialAmount
            });
          }
          break;
        
        case "transfer":
          await handleTransferOption(budget, envelope, currentRemaining);
          break;
          
        case "multi-transfer":
          await handleMultiTransferOption(budget, envelope, currentRemaining);
          break;
      }
    }
  };
  
  const handleTransferOption = async (budget: any, envelope: TransitionEnvelope, currentRemaining: number) => {
    if (envelope.transferTargetId) {
      // Récupérer le budget cible
      const targetBudget = await db.getBudgets().then(budgets => 
        budgets.find(b => b.id === envelope.transferTargetId)
      );

      if (targetBudget) {
        // Réinitialise le budget source
        await db.updateBudget({
          ...budget,
          spent: 0,
          carriedOver: 0
        });

        // Ajoute le montant restant au report du budget cible
        await db.updateBudget({
          ...targetBudget,
          carriedOver: (targetBudget.carriedOver || 0) + currentRemaining
        });

        console.log(`Transfert - Nouveau état:`, {
          sourceBudget: {
            title: budget.title,
            spent: 0,
            carriedOver: 0
          },
          targetBudget: {
            title: targetBudget.title,
            carriedOver: (targetBudget.carriedOver || 0) + currentRemaining
          }
        });
      }
    }
  };
  
  const handleMultiTransferOption = async (budget: any, envelope: TransitionEnvelope, currentRemaining: number) => {
    if (envelope.multiTransfers && envelope.multiTransfers.length > 0) {
      console.log(`Transferts multiples pour ${budget.title}:`, envelope.multiTransfers);
      
      // Calculer le montant total à transférer
      const totalTransferAmount = envelope.multiTransfers.reduce(
        (sum, transfer) => sum + transfer.amount, 0
      );
      
      // S'assurer que le montant total n'excède pas le montant disponible
      if (totalTransferAmount <= currentRemaining) {
        // Réinitialiser le budget source avec le montant restant non transféré
        const remainingAfterTransfers = currentRemaining - totalTransferAmount;
        
        await db.updateBudget({
          ...budget,
          spent: 0,
          carriedOver: remainingAfterTransfers
        });
        
        console.log(`Multi-transfert - Budget source mis à jour:`, {
          title: budget.title,
          spent: 0,
          carriedOver: remainingAfterTransfers
        });
        
        // Distribuer les montants aux budgets cibles
        for (const transfer of envelope.multiTransfers) {
          // Récupérer le budget cible
          const targetBudget = await db.getBudgets().then(budgets => 
            budgets.find(b => b.id === transfer.targetId)
          );
          
          if (targetBudget) {
            // Ajouter le montant au report du budget cible
            await db.updateBudget({
              ...targetBudget,
              carriedOver: (targetBudget.carriedOver || 0) + transfer.amount
            });
            
            console.log(`Multi-transfert - Budget cible mis à jour:`, {
              title: targetBudget.title,
              amount: transfer.amount,
              newCarriedOver: (targetBudget.carriedOver || 0) + transfer.amount
            });
          }
        }
      } else {
        console.error(`Montant total de transfert (${totalTransferAmount}) supérieur au montant disponible (${currentRemaining})`);
      }
    }
  };

  return {
    processEnvelopeTransitions
  };
};
