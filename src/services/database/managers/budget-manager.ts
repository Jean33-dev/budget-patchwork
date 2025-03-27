
import { toast } from "@/components/ui/use-toast";
import { Budget } from '../models/budget';
import { BaseDatabaseManager } from '../base-database-manager';
import { IBudgetManager } from '../interfaces/IBudgetManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling budget-related database operations
 */
export class BudgetManager extends BaseDatabaseManager implements IBudgetManager {
  /**
   * Get all budgets from the database
   */
  async getBudgets(): Promise<Budget[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
    return this.queryManager.executeGetBudgets();
  }

  /**
   * Add a new budget to the database
   */
  async addBudget(budget: Budget): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeAddBudget(budget);
  }

  /**
   * Update an existing budget in the database
   */
  async updateBudget(budget: Budget): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeUpdateBudget(budget);
  }

  /**
   * Delete a budget from the database
   */
  async deleteBudget(id: string): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeDeleteBudget(id);
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
