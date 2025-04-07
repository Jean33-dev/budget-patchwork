
import { QueryManager } from '../query-manager';
import { FixedExpense } from '../models/fixedExpense';
import { fixedExpenseQueries } from '../queries/fixed-expense-queries';
import { BaseQueryManager } from './base-query-manager';

export class FixedExpenseQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<FixedExpense[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return fixedExpenseQueries.getAll(db);
    } catch (error) {
      console.error("Error getting fixed expenses:", error);
      return [];
    }
  }

  async add(fixedExpense: FixedExpense): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedExpenseQueries.add(db, fixedExpense);
    } catch (error) {
      console.error("Error adding fixed expense:", error);
      throw error;
    }
  }

  async update(fixedExpense: FixedExpense): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedExpenseQueries.update(db, fixedExpense);
    } catch (error) {
      console.error("Error updating fixed expense:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedExpenseQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting fixed expense:", error);
      throw error;
    }
  }
  
  async deleteIfExists(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      
      const db = this.getDb();
      
      // Vérifier d'abord si la dépense fixe existe
      const fixedExpenses = await this.getAll();
      const exists = fixedExpenses.some(fe => fe.id === id);
      
      if (exists) {
        fixedExpenseQueries.delete(db, id);
      }
    } catch (error) {
      console.error(`Error checking and deleting fixed expense ${id}:`, error);
    }
  }
  
  async updateDates(newDate: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedExpenseQueries.updateDates(db, newDate);
    } catch (error) {
      console.error("Error updating fixed expenses dates:", error);
      throw error;
    }
  }
}
