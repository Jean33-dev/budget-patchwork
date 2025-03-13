
import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return expenseQueries.getAll(this.db);
  }

  async addExpense(expense: Expense): Promise<void> {
    await this.ensureInitialized();
    expenseQueries.add(this.db, expense);
    return Promise.resolve();
  }

  async updateExpense(expense: Expense): Promise<void> {
    await this.ensureInitialized();
    expenseQueries.update(this.db, expense);
    return Promise.resolve();
  }

  async deleteExpense(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!id) {
      console.error("Tentative de suppression avec un ID invalide");
      return Promise.resolve();
    }
    expenseQueries.delete(this.db, id);
    return Promise.resolve();
  }
}
