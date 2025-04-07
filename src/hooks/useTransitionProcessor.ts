
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { dbManager } from "@/services/database";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { fixedTransactionOperations } from "@/utils/fixed-transaction-operations";

export const useTransitionProcessor = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const { saveTransitionPreferences } = useTransitionPreferences();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      console.log("Début de la transition du mois...");
      
      // Save preferences for next time
      saveTransitionPreferences(envelopes);
      
      // Process budget transitions first (this is faster and doesn't require loading all expenses)
      console.log("Traitement des budgets pour la transition...");
      await processEnvelopeTransitions(envelopes);
      console.log("Transition des budgets terminée");
      
      // Récupérer toutes les dépenses et revenus
      console.log("Récupération des données de transactions...");
      const [expenses, incomes, nextFixedExpenses, nextFixedIncomes] = await Promise.all([
        dbManager.getExpenses(),
        dbManager.getIncomes(),
        fixedTransactionOperations.getFixedExpensesForImport(),
        fixedTransactionOperations.getFixedIncomesForImport()
      ]);
      
      console.log(`Total de ${expenses.length} dépenses et ${incomes.length} revenus à traiter`);
      console.log(`${nextFixedExpenses.length} dépenses fixes et ${nextFixedIncomes.length} revenus fixes récupérés`);
      
      // Batch delete operations to improve performance
      console.log("Suppression des transactions existantes...");
      const deletePromises = [
        ...expenses.map(expense => dbManager.deleteExpense(expense.id)),
        ...incomes.map(income => dbManager.deleteIncome(income.id))
      ];
      
      // Execute deletions in chunks to prevent overwhelming the database
      const CHUNK_SIZE = 20;
      for (let i = 0; i < deletePromises.length; i += CHUNK_SIZE) {
        await Promise.all(deletePromises.slice(i, i + CHUNK_SIZE));
      }
      console.log("Toutes les transactions ont été supprimées");
      
      // Add new fixed transactions in chunks
      console.log("Ajout des transactions fixes pour le mois suivant...");
      
      // Process expenses in chunks
      for (let i = 0; i < nextFixedExpenses.length; i += CHUNK_SIZE) {
        const chunk = nextFixedExpenses.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(expense => dbManager.addExpense(expense)));
      }
      
      // Process incomes in chunks
      for (let i = 0; i < nextFixedIncomes.length; i += CHUNK_SIZE) {
        const chunk = nextFixedIncomes.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(income => dbManager.addIncome(income)));
      }
      
      console.log("Toutes les transactions fixes ont été ajoutées");
      
      // Update fixed transaction dates for next month in one operation
      await fixedTransactionOperations.updateFixedTransactionsDates();
      
      // Reset category spent values in one batch
      console.log("Mise à jour des catégories...");
      const updatedCategories = categories.map(category => ({
        ...category,
        spent: 0
      }));
      
      // Update categories in chunks
      for (let i = 0; i < updatedCategories.length; i += CHUNK_SIZE) {
        const chunk = updatedCategories.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(category => dbManager.updateCategory(category)));
      }
      
      // Update local state
      setCategories(updatedCategories);
      
      console.log("Transition du mois terminée avec succès");
      toast({
        title: "Transition effectuée",
        description: "Les budgets ont été mis à jour pour le nouveau mois."
      });
    } catch (error) {
      console.error("Erreur lors de la transition:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la transition des budgets."
      });
      success = false;
    }

    return success;
  };

  const processEnvelopeTransitions = async (envelopes: TransitionEnvelope[]) => {
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
  };

  return {
    handleMonthTransition
  };
};
