
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
    
    try {
      const [expenses, incomes, nextFixedExpenses, nextFixedIncomes] = await Promise.all([
        dbManager.getExpenses(),
        dbManager.getIncomes(),
        fixedTransactionOperations.getFixedExpensesForImport(),
        fixedTransactionOperations.getFixedIncomesForImport()
      ]);
      
      console.log(`Total de ${expenses.length} dépenses et ${incomes.length} revenus à traiter`);
      console.log(`${nextFixedExpenses.length} dépenses fixes et ${nextFixedIncomes.length} revenus fixes récupérés`);
      
      if (expenses.length === 0 && incomes.length === 0) {
        console.log("Pas de transactions existantes à supprimer");
      } else {
        // Batch delete operations to improve performance
        console.log("Suppression des transactions existantes...");
        
        // Execute deletions in chunks to prevent overwhelming the database
        const CHUNK_SIZE = 20;
        
        // Delete expenses in chunks
        for (let i = 0; i < expenses.length; i += CHUNK_SIZE) {
          const chunk = expenses.slice(i, i + CHUNK_SIZE);
          console.log(`Suppression des dépenses: ${i+1}-${Math.min(i+CHUNK_SIZE, expenses.length)} sur ${expenses.length}`);
          await Promise.all(chunk.map(expense => dbManager.deleteExpense(expense.id)));
        }
        
        // Delete incomes in chunks
        for (let i = 0; i < incomes.length; i += CHUNK_SIZE) {
          const chunk = incomes.slice(i, i + CHUNK_SIZE);
          console.log(`Suppression des revenus: ${i+1}-${Math.min(i+CHUNK_SIZE, incomes.length)} sur ${incomes.length}`);
          await Promise.all(chunk.map(income => dbManager.deleteIncome(income.id)));
        }
        
        console.log("Toutes les transactions ont été supprimées");
      }
      
      // Add new fixed transactions in chunks
      if (nextFixedExpenses.length > 0 || nextFixedIncomes.length > 0) {
        console.log("Ajout des transactions fixes pour le mois suivant...");
        
        const CHUNK_SIZE = 20;
        
        // Process expenses in chunks
        for (let i = 0; i < nextFixedExpenses.length; i += CHUNK_SIZE) {
          const chunk = nextFixedExpenses.slice(i, i + CHUNK_SIZE);
          console.log(`Ajout des dépenses fixes: ${i+1}-${Math.min(i+CHUNK_SIZE, nextFixedExpenses.length)} sur ${nextFixedExpenses.length}`);
          await Promise.all(chunk.map(expense => dbManager.addExpense(expense)));
        }
        
        // Process incomes in chunks
        for (let i = 0; i < nextFixedIncomes.length; i += CHUNK_SIZE) {
          const chunk = nextFixedIncomes.slice(i, i + CHUNK_SIZE);
          console.log(`Ajout des revenus fixes: ${i+1}-${Math.min(i+CHUNK_SIZE, nextFixedIncomes.length)} sur ${nextFixedIncomes.length}`);
          await Promise.all(chunk.map(income => dbManager.addIncome(income)));
        }
        
        console.log("Toutes les transactions fixes ont été ajoutées");
      } else {
        console.log("Pas de transactions fixes à ajouter");
      }
      
      // Update fixed transaction dates for next month in one operation
      await fixedTransactionOperations.updateFixedTransactionsDates();
      console.log("Dates des transactions fixes mises à jour");
      
    } catch (error) {
      console.error("Erreur lors du traitement des transactions:", error);
      throw error;
    }
  },

  /**
   * Reset category spending for the new month
   */
  async resetCategorySpending(categories: Category[], setCategories: (categories: Category[]) => void): Promise<void> {
    try {
      console.log("Mise à jour des catégories...");
      if (!categories || categories.length === 0) {
        console.warn("Aucune catégorie à réinitialiser");
        return;
      }
      
      const CHUNK_SIZE = 20;
      
      const updatedCategories = categories.map(category => ({
        ...category,
        spent: 0
      }));
      
      // Update categories in chunks
      for (let i = 0; i < updatedCategories.length; i += CHUNK_SIZE) {
        const chunk = updatedCategories.slice(i, i + CHUNK_SIZE);
        console.log(`Mise à jour des catégories: ${i+1}-${Math.min(i+CHUNK_SIZE, updatedCategories.length)} sur ${updatedCategories.length}`);
        await Promise.all(chunk.map(category => dbManager.updateCategory(category)));
      }
      
      // Update local state
      setCategories(updatedCategories);
      console.log("Toutes les catégories ont été réinitialisées");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des catégories:", error);
      throw error;
    }
  }
};
