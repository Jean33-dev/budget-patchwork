
import { QueryManager } from '../query-manager';
import { FixedIncome } from '../models/fixedIncome';
import { fixedIncomeQueries } from '../queries/fixed-income-queries';
import { BaseQueryManager } from './base-query-manager';

export class FixedIncomeQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<FixedIncome[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return fixedIncomeQueries.getAll(db);
    } catch (error) {
      console.error("Error getting fixed incomes:", error);
      return [];
    }
  }

  async add(fixedIncome: FixedIncome): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedIncomeQueries.add(db, fixedIncome);
    } catch (error) {
      console.error("Error adding fixed income:", error);
      throw error;
    }
  }

  async update(fixedIncome: FixedIncome): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedIncomeQueries.update(db, fixedIncome);
    } catch (error) {
      console.error("Error updating fixed income:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedIncomeQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting fixed income:", error);
      throw error;
    }
  }
  
  async deleteIfExists(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      
      const db = this.getDb();
      
      // Vérifier d'abord si le revenu fixe existe
      const fixedIncomes = await this.getAll();
      const exists = fixedIncomes.some(fi => fi.id === id);
      
      if (exists) {
        fixedIncomeQueries.delete(db, id);
      }
    } catch (error) {
      console.error(`Error checking and deleting fixed income ${id}:`, error);
    }
  }
  
  async updateDates(newDate: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      fixedIncomeQueries.updateDates(db, newDate);
    } catch (error) {
      console.error("Error updating fixed incomes dates:", error);
      throw error;
    }
  }
}
