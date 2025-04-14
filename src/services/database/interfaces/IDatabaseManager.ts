
import { IBudgetManager } from './IBudgetManager';
import { ICategoryManager } from './ICategoryManager';
import { IExpenseManager } from './IExpenseManager';
import { IIncomeManager } from './IIncomeManager';
import { DashboardManager } from '../managers/dashboard-manager';
import { Database } from 'sql.js';

/**
 * Interface for database manager
 */
export interface IDatabaseManager {
  init(): Promise<boolean>;
  getDb(): Database;
  getBudgetManager(): IBudgetManager;
  getCategoryManager(): ICategoryManager;
  getExpenseManager(): IExpenseManager;
  getIncomeManager(): IIncomeManager;
  getDashboardManager(): DashboardManager;
  resetInitializationAttempts?(): void;
}
