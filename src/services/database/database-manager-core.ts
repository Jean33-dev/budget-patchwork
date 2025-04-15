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
    // Create the query manager with this instance
    this.queryManager = new QueryManager(this);
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
      console.log("Creating new BudgetManager instance");
      this.budgetManager = new BudgetManager();
      if (this.queryManager) {
        this.budgetManager.setQueryManager(this.queryManager);
      }
    }
    return this.budgetManager!;
  }

  /**
   * Get category manager
   * @returns CategoryManager
   */
  getCategoryManager(): ICategoryManager {
    if (!this.categoryManager) {
      console.log("Creating new CategoryManager instance");
      this.categoryManager = new CategoryManager();
      if (this.queryManager) {
        this.categoryManager.setQueryManager(this.queryManager);
      }
    }
    return this.categoryManager!;
  }

  /**
   * Get expense manager
   * @returns ExpenseManager
   */
  getExpenseManager(): IExpenseManager {
    if (!this.expenseManager) {
      console.log("Creating new ExpenseManager instance");
      this.expenseManager = new ExpenseManager();
      if (this.queryManager) {
        this.expenseManager.setQueryManager(this.queryManager);
      }
    }
    return this.expenseManager!;
  }

  /**
   * Get income manager
   * @returns IncomeManager
   */
  getIncomeManager(): IIncomeManager {
    if (!this.incomeManager) {
      console.log("Creating new IncomeManager instance");
      this.incomeManager = new IncomeManager();
      if (this.queryManager) {
        this.incomeManager.setQueryManager(this.queryManager);
      }
    }
    return this.incomeManager!;
  }

  /**
   * Get dashboard manager
   * @returns DashboardManager
   */
  getDashboardManager(): DashboardManager {
    if (!this.dashboardManager) {
      console.log("Creating new DashboardManager instance");
      this.dashboardManager = new DashboardManager();
      if (this.queryManager) {
        this.dashboardManager.setQueryManager(this.queryManager);
      }
    }
    return this.dashboardManager!;
  }

  /**
   * Reset initialization attempts
   */
  resetInitializationAttempts(): void {
    // This will be implemented in subclasses
  }

  /**
   * Safely add a dashboard (doesn't throw exceptions)
   */
  async safeAddDashboard(dashboard: any): Promise<boolean> {
    await this.init();
    return this.getDashboardManager().safeAddDashboard(dashboard);
  }

  // Proxy methods to respective managers
  async getDashboards(): Promise<any[]> {
    await this.init();
    return this.getDashboardManager().getDashboards();
  }

  async getBudgets(): Promise<any[]> {
    await this.init();
    return this.getBudgetManager().getBudgets();
  }

  async getExpenses(): Promise<any[]> {
    await this.init();
    return this.getExpenseManager().getExpenses();
  }

  async getIncomes(): Promise<any[]> {
    await this.init();
    return this.getIncomeManager().getIncomes();
  }
  
  async getCategories(): Promise<any[]> {
    await this.init();
    return this.getCategoryManager().getCategories();
  }

  async addDashboard(dashboard: any): Promise<void> {
    await this.init();
    return this.getDashboardManager().addDashboard(dashboard);
  }

  async updateDashboard(dashboard: any): Promise<void> {
    await this.init();
    return this.getDashboardManager().updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    await this.init();
    return this.getDashboardManager().deleteDashboard(id);
  }
}
