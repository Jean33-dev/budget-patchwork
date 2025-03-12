
import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    const expenses = expenseQueries.getAll(this.db);
    console.log("Dépenses récupérées:", expenses.length);
    return expenses;
  }

  async addExpense(expense: Expense) {
    await this.ensureInitialized();
    expenseQueries.add(this.db, expense);
  }

  async updateExpense(expense: Expense) {
    await this.ensureInitialized();
    expenseQueries.update(this.db, expense);
  }

  async deleteExpense(id: string): Promise<boolean> {
    try {
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return false;
      }
      
      await this.ensureInitialized();
      const result = expenseQueries.hideExpense(this.db, id);
      
      // Log pour le débogage
      console.log(`Résultat de la suppression (masquage) de l'expense ${id}:`, result);
      
      return result;
    } catch (error) {
      console.error(`Erreur dans ExpenseManager.deleteExpense pour l'ID ${id}:`, error);
      return false;
    }
  }
  
  // Méthode de suppression permanente (conservation pour maintenance)
  async permanentlyDeleteExpense(id: string): Promise<boolean> {
    try {
      if (!id) {
        return false;
      }
      
      await this.ensureInitialized();
      return expenseQueries.delete(this.db, id);
    } catch (error) {
      console.error(`Erreur lors de la suppression permanente:`, error);
      return false;
    }
  }
}
