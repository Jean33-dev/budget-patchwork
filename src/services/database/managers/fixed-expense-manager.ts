
import { FixedExpense } from '../models/fixedExpense';
import { BaseDatabaseManager } from '../base-database-manager';
import { IFixedExpenseManager } from '../interfaces/IFixedExpenseManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling fixed expense-related database operations
 */
export class FixedExpenseManager extends BaseDatabaseManager implements IFixedExpenseManager {
  /**
   * Get all fixed expenses from the database
   */
  async getFixedExpenses(): Promise<FixedExpense[]> {
    await this.ensureInitialized();
    const result = await this.queryManager.executeGetFixedExpenses();
    return result;
  }

  /**
   * Add a new fixed expense to the database
   */
  async addFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeAddFixedExpense(fixedExpense);
  }

  /**
   * Update an existing fixed expense in the database
   */
  async updateFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateFixedExpense(fixedExpense);
  }

  /**
   * Delete a fixed expense from the database
   */
  async deleteFixedExpense(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteFixedExpense(id);
  }
  
  /**
   * Delete a fixed expense if it exists
   */
  async deleteFixedExpenseIfExists(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.queryManager.executeDeleteFixedExpenseIfExists(id);
    } catch (error) {
      console.error(`Error in deleteFixedExpenseIfExists for ID ${id}:`, error);
    }
  }
  
  /**
   * Update dates for all fixed expenses
   */
  async updateFixedExpensesDates(newDate: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateFixedExpensesDates(newDate);
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
