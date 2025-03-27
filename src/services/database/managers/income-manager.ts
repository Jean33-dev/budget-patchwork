
import { toast } from "@/components/ui/use-toast";
import { Income } from '../models/income';
import { BaseDatabaseManager } from '../base-database-manager';

/**
 * Responsible for handling income-related database operations
 */
export class IncomeManager extends BaseDatabaseManager {
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
  async addIncome(income: Income) {
    await this.ensureInitialized();
    await this.queryManager.executeAddIncome(income);
  }

  /**
   * Update an existing income in the database
   */
  async updateIncome(income: Income) {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateIncome(income);
  }

  /**
   * Delete an income from the database
   */
  async deleteIncome(id: string) {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteIncome(id);
  }
}
