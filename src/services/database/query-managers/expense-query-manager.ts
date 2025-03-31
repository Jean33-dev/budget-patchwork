
import { QueryManager } from '../query-manager';
import { Expense } from '../models/expense';
import { expenseQueries } from '../queries/expense-queries';
import { BaseQueryManager } from './base-query-manager';

export class ExpenseQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Expense[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return expenseQueries.getAll(db);
    } catch (error) {
      console.error("Error getting expenses:", error);
      return [];
    }
  }

  async add(expense: Expense): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      expenseQueries.add(db, expense);
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  }

  async update(expense: Expense): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      expenseQueries.update(db, expense);
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success || !id) return;
      const db = this.getDb();
      expenseQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  }
}
