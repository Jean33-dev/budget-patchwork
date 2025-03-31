
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
      console.log("ExpenseQueryManager.getAll: Starting...");
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("ExpenseQueryManager.getAll: Parent not initialized");
        return [];
      }
      const db = this.getDb();
      if (!db) {
        console.error("ExpenseQueryManager.getAll: Database is null");
        return [];
      }
      const result = expenseQueries.getAll(db);
      console.log(`ExpenseQueryManager.getAll: Got ${result.length} expenses`);
      return result;
    } catch (error) {
      console.error("Error getting expenses:", error);
      return [];
    }
  }

  async add(expense: Expense): Promise<void> {
    try {
      console.log("ExpenseQueryManager.add: Starting...", expense);
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("ExpenseQueryManager.add: Parent not initialized");
        return;
      }
      const db = this.getDb();
      if (!db) {
        console.error("ExpenseQueryManager.add: Database is null");
        return;
      }
      expenseQueries.add(db, expense);
      console.log("ExpenseQueryManager.add: Expense added successfully");
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  }

  async update(expense: Expense): Promise<void> {
    try {
      console.log("ExpenseQueryManager.update: Starting...", expense);
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("ExpenseQueryManager.update: Parent not initialized");
        return;
      }
      const db = this.getDb();
      if (!db) {
        console.error("ExpenseQueryManager.update: Database is null");
        return;
      }
      expenseQueries.update(db, expense);
      console.log("ExpenseQueryManager.update: Expense updated successfully");
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log(`ExpenseQueryManager.delete: Starting with ID: ${id}`);
      if (!id) {
        console.error("ExpenseQueryManager.delete: ID is empty");
        return;
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("ExpenseQueryManager.delete: Parent not initialized");
        return;
      }
      
      const db = this.getDb();
      if (!db) {
        console.error("ExpenseQueryManager.delete: Database is null");
        return;
      }
      
      console.log(`ExpenseQueryManager.delete: Deleting expense with ID: ${id}`);
      expenseQueries.delete(db, id);
      console.log("ExpenseQueryManager.delete: Expense deleted successfully");
    } catch (error) {
      console.error(`Error deleting expense with ID ${id}:`, error);
      throw error;
    }
  }
}
