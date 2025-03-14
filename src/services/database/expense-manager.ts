
import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    try {
      await this.ensureInitialized();
      return expenseQueries.getAll(this.db);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      await this.ensureInitialized();
      expenseQueries.add(this.db, expense);
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      return Promise.reject(error);
    }
  }
}
