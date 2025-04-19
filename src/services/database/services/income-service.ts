
import { Income } from '../models/income';
import { BaseService } from './base-service';
import { SavedTransitionPreference } from '@/hooks/transition/useTransitionPreferencesGet';
import { dbManager } from '../index';

export class IncomeService extends BaseService {
  /**
   * Get all incomes
   */
  async getIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return dbManager.getIncomes();
  }
  
  /**
   * Get recurring incomes only
   */
  async getRecurringIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return dbManager.getRecurringIncomes();
  }
  
  /**
   * Add a new income
   */
  async addIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    return dbManager.addIncome(income);
  }
  
  /**
   * Update an existing income
   */
  async updateIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    return dbManager.updateIncome(income);
  }
  
  /**
   * Delete an income by ID
   */
  async deleteIncome(id: string): Promise<void> {
    await this.ensureInitialized();
    return dbManager.deleteIncome(id);
  }
  
  /**
   * Copy a recurring income to a specific month
   */
  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    await this.ensureInitialized();
    return dbManager.copyRecurringIncomeToMonth(incomeId, targetDate);
  }
  
  /**
   * Get transition preferences from the database
   */
  async getTransitionPreferences(): Promise<SavedTransitionPreference[] | null> {
    await this.ensureInitialized();
    return dbManager.getTransitionPreferences();
  }
  
  /**
   * Save transition preferences to the database
   */
  async saveTransitionPreferences(preferences: SavedTransitionPreference[]): Promise<boolean> {
    await this.ensureInitialized();
    return dbManager.saveTransitionPreferences(preferences);
  }
  
  /**
   * Export database data
   */
  exportData(): Uint8Array | null {
    return dbManager.exportData();
  }
  
  /**
   * Import data into the database
   * Note: Using exportData as importData is not available on DatabaseManager
   */
  importData(data: Uint8Array): boolean {
    // Since importData is not directly available on DatabaseManager,
    // we're returning false to indicate that the operation is not supported
    console.warn("importData operation is not supported in the current implementation");
    return false;
  }

  /**
   * Reset initialization attempts
   */
  resetInitializationAttempts(): void {
    dbManager.resetInitializationAttempts();
  }
}
