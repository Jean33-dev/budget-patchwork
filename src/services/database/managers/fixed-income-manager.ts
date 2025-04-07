
import { FixedIncome } from '../models/fixedIncome';
import { BaseDatabaseManager } from '../base-database-manager';
import { IFixedIncomeManager } from '../interfaces/IFixedIncomeManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling fixed income-related database operations
 */
export class FixedIncomeManager extends BaseDatabaseManager implements IFixedIncomeManager {
  /**
   * Get all fixed incomes from the database
   */
  async getFixedIncomes(): Promise<FixedIncome[]> {
    await this.ensureInitialized();
    const result = await this.queryManager.executeGetFixedIncomes();
    return result;
  }

  /**
   * Add a new fixed income to the database
   */
  async addFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeAddFixedIncome(fixedIncome);
  }

  /**
   * Update an existing fixed income in the database
   */
  async updateFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateFixedIncome(fixedIncome);
  }

  /**
   * Delete a fixed income from the database
   */
  async deleteFixedIncome(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteFixedIncome(id);
  }
  
  /**
   * Delete a fixed income if it exists
   */
  async deleteFixedIncomeIfExists(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.queryManager.executeDeleteFixedIncomeIfExists(id);
    } catch (error) {
      console.error(`Error in deleteFixedIncomeIfExists for ID ${id}:`, error);
    }
  }
  
  /**
   * Update dates for all fixed incomes
   */
  async updateFixedIncomesDates(newDate: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateFixedIncomesDates(newDate);
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
