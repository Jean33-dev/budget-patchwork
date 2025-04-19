
import { Income } from '../models/income';
import { BaseService } from './base-service';
import { SavedTransitionPreference } from '@/hooks/transition/useTransitionPreferencesGet';

export class IncomeService extends BaseService {
  /**
   * Get all incomes
   */
  async getIncomes(): Promise<Income[]> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.getIncomes();
  }
  
  /**
   * Get recurring incomes only
   */
  async getRecurringIncomes(): Promise<Income[]> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.getRecurringIncomes();
  }
  
  /**
   * Add a new income
   */
  async addIncome(income: Income): Promise<void> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.addIncome(income);
  }
  
  /**
   * Update an existing income
   */
  async updateIncome(income: Income): Promise<void> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.updateIncome(income);
  }
  
  /**
   * Delete an income by ID
   */
  async deleteIncome(id: string): Promise<void> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.deleteIncome(id);
  }
  
  /**
   * Copy a recurring income to a specific month
   */
  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.copyRecurringIncomeToMonth(incomeId, targetDate);
  }
  
  /**
   * Get transition preferences from the database
   */
  async getTransitionPreferences(): Promise<SavedTransitionPreference[] | null> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.getTransitionPreferences();
  }
  
  /**
   * Save transition preferences to the database
   */
  async saveTransitionPreferences(preferences: SavedTransitionPreference[]): Promise<boolean> {
    await this.ensureDatabaseInitialized();
    return this.dbManager.saveTransitionPreferences(preferences);
  }
  
  /**
   * Export database data
   */
  exportData(): Uint8Array | null {
    return this.dbManager.exportData();
  }
  
  /**
   * Import data into the database
   */
  importData(data: Uint8Array): boolean {
    return this.dbManager.importData(data);
  }

  /**
   * Reset initialization attempts
   */
  resetInitializationAttempts(): void {
    this.dbManager.resetInitializationAttempts();
  }
}
