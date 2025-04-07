
import { dbManager } from "@/services/database";
import { fixedTransactionOperations } from "@/utils/fixed-transaction-operations";
import { Category } from "@/services/database/models/category";

/**
 * Handles the processing of transactions during the month transition
 */
export const transactionTransitionOperations = {
  /**
   * Process transaction cleanup and re-creation for the new month
   */
  async processTransactionTransition(categories: Category[], setCategories: (categories: Category[]) => void): Promise<void> {
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
  },

  /**
   * Reset category spending for the new month
   */
  async resetCategorySpending(categories: Category[], setCategories: (categories: Category[]) => void): Promise<void> {
    console.log("Mise à jour des catégories...");
    const CHUNK_SIZE = 20;
    
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
  }
};
