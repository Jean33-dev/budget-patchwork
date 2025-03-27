
import { toast } from "@/components/ui/use-toast";
import { Income } from '../models/income';
import { BaseDatabaseManager } from '../base-database-manager';
import { IIncomeManager } from '../interfaces/IIncomeManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling income-related database operations
 */
export class IncomeManager extends BaseDatabaseManager implements IIncomeManager {
  /**
   * Get all incomes from the database
   */
  async getIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return this.queryManager.executeGetIncomes();
  }

  /**
   * Add a new income to the database
   */
  async addIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeAddIncome(income);
  }

  /**
   * Update an existing income in the database
   */
  async updateIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateIncome(income);
  }

  /**
   * Delete an income from the database
   */
  async deleteIncome(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteIncome(id);
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
