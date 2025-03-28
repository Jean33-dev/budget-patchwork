
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
      if (!success) {
        console.error("Parent query manager not initialized in getAll");
        return [];
      }
      
      const db = this.getDb();
      if (!db) {
        console.error("Database is null in ExpenseQueryManager.getAll");
        return [];
      }
      
      return expenseQueries.getAll(db);
    } catch (error) {
      console.error("Error getting expenses:", error);
      this.logError("retrieving expenses", error);
      return [];
    }
  }

  async add(expense: Expense): Promise<void> {
    try {
      if (!expense || !expense.id) {
        throw new Error("Invalid expense data: missing id");
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        throw new Error("Parent query manager not initialized in add");
      }
      
      const db = this.getDb();
      if (!db) {
        throw new Error("Database is null in ExpenseQueryManager.add");
      }
      
      expenseQueries.add(db, expense);
    } catch (error) {
      console.error("Error adding expense:", error);
      this.logError("adding expense", error);
      throw error;
    }
  }

  async update(expense: Expense): Promise<void> {
    try {
      if (!expense || !expense.id) {
        throw new Error("Invalid expense data: missing id");
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        throw new Error("Parent query manager not initialized in update");
      }
      
      const db = this.getDb();
      if (!db) {
        throw new Error("Database is null in ExpenseQueryManager.update");
      }
      
      // Vérifier si la dépense existe avant de tenter de la mettre à jour
      const expenses = await this.getAll();
      const existingExpense = expenses.find(e => e.id === expense.id);
      if (!existingExpense) {
        console.warn(`ExpenseQueryManager: Expense with ID ${expense.id} not found for update`);
        return; // Sortir sans erreur, mais sans mettre à jour
      }
      
      console.log("ExpenseQueryManager: Executing update for expense:", expense.id);
      expenseQueries.update(db, expense);
    } catch (error) {
      console.error("Error updating expense:", error);
      this.logError("updating expense", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error("Invalid expense id: empty or undefined");
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        throw new Error("Parent query manager not initialized in delete");
      }
      
      const db = this.getDb();
      if (!db) {
        throw new Error("Database is null in ExpenseQueryManager.delete");
      }
      
      // Vérifier si la dépense existe avant de tenter de la supprimer
      const expenses = await this.getAll();
      const existingExpense = expenses.find(e => e.id === id);
      if (!existingExpense) {
        console.warn(`ExpenseQueryManager: Expense with ID ${id} not found for deletion`);
        return; // Sortir sans erreur, mais sans supprimer
      }
      
      console.log("ExpenseQueryManager: Executing delete for expense ID:", id);
      expenseQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting expense:", error);
      this.logError("deleting expense", error);
      throw error;
    }
  }
}
