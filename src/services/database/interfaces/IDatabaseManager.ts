
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
  resetInitializationAttempts(): void;
  isInitialized(): boolean;
  isInitializationInProgress(): boolean;
  getDashboards(): Promise<any[]>;
  getBudgets(): Promise<any[]>;
  getExpenses(): Promise<any[]>;
  getIncomes(): Promise<any[]>;
  getCategories(): Promise<any[]>;
  addDashboard(dashboard: any): Promise<void>;
  updateDashboard(dashboard: any): Promise<void>;
  deleteDashboard(id: string): Promise<void>;
  safeAddDashboard(dashboard: any): Promise<boolean>;  // New method for safely adding dashboards
}
