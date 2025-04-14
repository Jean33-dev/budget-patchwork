
import { Database } from 'sql.js';
import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { IQueryManager } from './interfaces/IQueryManager';
import { QueryManager } from './query-manager';
import { BudgetManager } from './managers/budget-manager';
import { CategoryManager } from './managers/category-manager';
import { ExpenseManager } from './managers/expense-manager';
import { IncomeManager } from './managers/income-manager';
import { DashboardManager } from './managers/dashboard-manager';
import { IBudgetManager } from './interfaces/IBudgetManager';
import { ICategoryManager } from './interfaces/ICategoryManager';
import { IExpenseManager } from './interfaces/IExpenseManager';
import { IIncomeManager } from './interfaces/IIncomeManager';
import { DatabaseInitManager } from './database-init-manager';

/**
 * Core database manager
 */
export abstract class DatabaseManagerCore implements IDatabaseManager {
  protected db?: Database;
  protected queryManager: IQueryManager;
  protected budgetManager?: BudgetManager;
  protected categoryManager?: CategoryManager;
  protected expenseManager?: ExpenseManager;
  protected incomeManager?: IncomeManager;
  protected dashboardManager?: DashboardManager;
  protected initialized = false;
  protected initializationInProgress = false;

  constructor() {
    this.queryManager = new QueryManager();
  }

  /**
   * Get database
   * @returns Database
   */
  getDb(): Database {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  /**
   * Check if database is initialized
   * @returns boolean
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Set isInitialized flag
   * @param isInitialized
   * @returns void
   */
  setInitialized(isInitialized: boolean): void {
    this.initialized = isInitialized;
  }

  /**
   * Check if initialization is in progress
   */
  isInitializationInProgress(): boolean {
    return this.initializationInProgress;
  }

  /**
   * Set initialization in progress flag
   */
  setInitializationInProgress(inProgress: boolean): void {
    this.initializationInProgress = inProgress;
  }

  /**
   * Initialize database
   * @returns Promise<boolean>
   */
  abstract init(): Promise<boolean>;

  /**
   * Get budget manager
   * @returns BudgetManager
   */
  getBudgetManager(): IBudgetManager {
    if (!this.budgetManager) {
      this.budgetManager = new BudgetManager(this.queryManager);
    }
    return this.budgetManager;
  }

  /**
   * Get category manager
   * @returns CategoryManager
   */
  getCategoryManager(): ICategoryManager {
    if (!this.categoryManager) {
      this.categoryManager = new CategoryManager(this.queryManager);
    }
    return this.categoryManager;
  }

  /**
   * Get expense manager
   * @returns ExpenseManager
   */
  getExpenseManager(): IExpenseManager {
    if (!this.expenseManager) {
      this.expenseManager = new ExpenseManager(this.queryManager);
    }
    return this.expenseManager;
  }

  /**
   * Get income manager
   * @returns IncomeManager
   */
  getIncomeManager(): IIncomeManager {
    if (!this.incomeManager) {
      this.incomeManager = new IncomeManager(this.queryManager);
    }
    return this.incomeManager;
  }

  /**
   * Get dashboard manager
   * @returns DashboardManager
   */
  getDashboardManager(): DashboardManager {
    if (!this.dashboardManager) {
      this.dashboardManager = new DashboardManager(this.queryManager);
    }
    return this.dashboardManager;
  }
}
