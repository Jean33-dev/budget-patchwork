
import { IBudgetManager } from './IBudgetManager';
import { ICategoryManager } from './ICategoryManager';
import { IExpenseManager } from './IExpenseManager';
import { IIncomeManager } from './IIncomeManager';
import { DashboardManager } from '../managers/dashboard-manager';

/**
 * Interface for database manager
 */
export interface IDatabaseManager {
  init(): Promise<boolean>;
  getBudgetManager(): IBudgetManager;
  getCategoryManager(): ICategoryManager;
  getExpenseManager(): IExpenseManager;
  getIncomeManager(): IIncomeManager;
  getDashboardManager(): DashboardManager;
  resetInitializationAttempts?(): void;
}
