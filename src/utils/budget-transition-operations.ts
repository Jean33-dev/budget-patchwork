
import { TransitionEnvelope } from "@/types/transition";
import { dbManager } from "@/services/database";

/**
 * Handles the processing of budget envelopes during the month transition
 */
export const budgetTransitionOperations = {
  /**
   * Process all envelope transitions and update budgets in the database
   */
  async processEnvelopeTransitions(envelopes: TransitionEnvelope[]): Promise<void> {
    // Get all budgets at once rather than querying for each envelope
    const allBudgets = await dbManager.getBudgets();
    if (!allBudgets || allBudgets.length === 0) {
      console.error("Aucun budget trouvé pour la transition");
      throw new Error("Aucun budget trouvé pour la transition");
    }
    
    console.log(`${allBudgets.length} budgets récupérés, préparation des mises à jour...`);
    
    const budgetUpdates = [];
    
    // Process all envelopes and collect updates
    for (const envelope of envelopes) {
      const budget = allBudgets.find(b => b.id === envelope.id);
      if (!budget) {
        console.warn(`Budget non trouvé pour l'enveloppe ${envelope.id}`);
        continue;
      }

      // Calcul du montant restant : budget initial + report précédent - dépenses
      const currentRemaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
      console.log(`Traitement de l'enveloppe ${budget.title}: ${envelope.transitionOption}, restant: ${currentRemaining}`);
      
      switch (envelope.transitionOption) {
        case "reset":
          budgetUpdates.push({
            ...budget,
            spent: 0,
            carriedOver: 0
          });
          break;
        
        case "carry":
          budgetUpdates.push({
            ...budget,
            spent: 0,
            carriedOver: currentRemaining
          });
          break;
        
        case "partial":
          if (envelope.partialAmount !== undefined) {
            budgetUpdates.push({
              ...budget,
              spent: 0,
              carriedOver: envelope.partialAmount
            });
          }
          break;
        
        case "transfer":
          if (envelope.transferTargetId) {
            const targetBudget = allBudgets.find(b => b.id === envelope.transferTargetId);
            
            if (targetBudget) {
              // Source budget update
              budgetUpdates.push({
                ...budget,
                spent: 0,
                carriedOver: 0
              });
              
              // Target budget update
              budgetUpdates.push({
                ...targetBudget,
                carriedOver: (targetBudget.carriedOver || 0) + currentRemaining
              });
            }
          }
          break;
          
        case "multi-transfer":
          if (envelope.multiTransfers && envelope.multiTransfers.length > 0) {
            const totalTransferAmount = envelope.multiTransfers.reduce(
              (sum, transfer) => sum + transfer.amount, 0
            );
            
            if (totalTransferAmount <= currentRemaining) {
              // Source budget update with remaining amount
              const remainingAfterTransfers = currentRemaining - totalTransferAmount;
              budgetUpdates.push({
                ...budget,
                spent: 0,
                carriedOver: remainingAfterTransfers
              });
              
              // Process target budget updates
              for (const transfer of envelope.multiTransfers) {
                const targetBudget = allBudgets.find(b => b.id === transfer.targetId);
                if (targetBudget) {
                  budgetUpdates.push({
                    ...targetBudget,
                    carriedOver: (targetBudget.carriedOver || 0) + transfer.amount
                  });
                }
              }
            }
          }
          break;
      }
    }
    
    console.log(`${budgetUpdates.length} mises à jour de budgets préparées`);
    
    if (budgetUpdates.length === 0) {
      console.warn("Aucune mise à jour de budget à effectuer");
      return;
    }
    
    // Apply all budget updates in chunks for better performance
    const CHUNK_SIZE = 10;
    for (let i = 0; i < budgetUpdates.length; i += CHUNK_SIZE) {
      const chunk = budgetUpdates.slice(i, i + CHUNK_SIZE);
      console.log(`Mise à jour des budgets: ${i+1}-${Math.min(i+CHUNK_SIZE, budgetUpdates.length)} sur ${budgetUpdates.length}`);
      
      try {
        await Promise.all(chunk.map(budget => dbManager.updateBudget(budget)));
      } catch (error) {
        console.error(`Erreur lors de la mise à jour des budgets (chunk ${i}):`, error);
        throw error;
      }
    }
    
    console.log("Toutes les mises à jour de budgets ont été effectuées avec succès");
  }
};
