
import { toast } from "@/components/ui/use-toast";
import { Budget } from '../models/budget';
import { BaseDatabaseManager } from '../base-database-manager';

/**
 * Responsible for handling budget-related database operations
 */
export class BudgetManager extends BaseDatabaseManager {
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
  async addBudget(budget: Budget) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeAddBudget(budget);
  }

  /**
   * Update an existing budget in the database
   */
  async updateBudget(budget: Budget) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeUpdateBudget(budget);
  }

  /**
   * Delete a budget from the database
   */
  async deleteBudget(id: string) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeDeleteBudget(id);
  }
}
