import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return expenseQueries.getAll(this.db);
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
      await this.ensureInitialized();
      
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return false;
      }
      
      // Simply call hideExpense - fewer layers of abstraction
      return expenseQueries.hideExpense(this.db, id);
    } catch (error) {
      console.error(`Erreur dans ExpenseManager.deleteExpense pour l'ID ${id}:`, error);
      return false;
    }
  }
  
  // Keep the permanent delete method for maintenance
  async permanentlyDeleteExpense(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      if (!id) {
        return false;
      }
      
      return expenseQueries.delete(this.db, id);
    } catch (error) {
      console.error(`Erreur lors de la suppression permanente:`, error);
      return false;
    }
  }
}
