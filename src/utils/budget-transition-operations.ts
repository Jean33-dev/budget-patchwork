
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
    const budgetUpdates = [];
    
    // Process all envelopes and collect updates
    for (const envelope of envelopes) {
      const budget = allBudgets.find(b => b.id === envelope.id);
      if (!budget) continue;

      // Calcul du montant restant : budget initial + report précédent - dépenses
      const currentRemaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
      
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
    
    // Apply all budget updates in chunks for better performance
    const CHUNK_SIZE = 20;
    for (let i = 0; i < budgetUpdates.length; i += CHUNK_SIZE) {
      const chunk = budgetUpdates.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(budget => dbManager.updateBudget(budget)));
    }
  }
};
