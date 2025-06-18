
import { BudgetManager } from './managers/budget-manager';
import { ExpenseManager } from './managers/expense-manager';
import { IncomeManager } from './managers/income-manager';
import { CategoryManager } from './managers/category-manager';
import { DashboardManager } from './managers/dashboard-manager';
import { QueryManager } from './query-manager';
import { IBudgetManager } from './interfaces/IBudgetManager';
import { IExpenseManager } from './interfaces/IExpenseManager';
import { IIncomeManager } from './interfaces/IIncomeManager';
import { ICategoryManager } from './interfaces/ICategoryManager';
import { IDashboardManager } from './interfaces/IDashboardManager';
import { IQueryManager } from './interfaces/IQueryManager';

/**
 * Factory that creates and coordinates all specialized database managers
 */
export class DatabaseManagerFactory {
  private budgetManager: IBudgetManager;
  private expenseManager: IExpenseManager;
  private incomeManager: IIncomeManager;
  private categoryManager: ICategoryManager;
  private dashboardManager: IDashboardManager;
  private queryManager: IQueryManager;
  
  constructor() {
    this.queryManager = new QueryManager();
    this.budgetManager = new BudgetManager();
    this.expenseManager = new ExpenseManager();
    this.incomeManager = new IncomeManager();
    this.categoryManager = new CategoryManager();
    this.dashboardManager = new DashboardManager();
  }
  
  /**
   * Initialize all managers with the provided database instance
   */
  initializeManagers(dbInstance: any): void {
    if (!dbInstance) {
      console.error("Cannot initialize managers with null database instance");
      return;
    }
    
    // Set the database instance for the query manager
    this.queryManager.setDb(dbInstance);
    this.queryManager.setInitialized(true);
    
    // Set the database instance for all specialized managers
    this.budgetManager.setDb(dbInstance);
    this.expenseManager.setDb(dbInstance);
    this.incomeManager.setDb(dbInstance);
    this.categoryManager.setDb(dbInstance);
    this.dashboardManager.setDb(dbInstance);
    
    // Set all managers as initialized
    this.budgetManager.setInitialized(true);
    this.expenseManager.setInitialized(true);
    this.incomeManager.setInitialized(true);
    this.categoryManager.setInitialized(true);
    this.dashboardManager.setInitialized(true);
    
    // Ensure all managers have a query manager reference
    this.budgetManager.setQueryManager(this.queryManager);
    this.expenseManager.setQueryManager(this.queryManager);
    this.incomeManager.setQueryManager(this.queryManager);
    this.categoryManager.setQueryManager(this.queryManager);
    this.dashboardManager.setQueryManager(this.queryManager);
  }
  
  getBudgetManager(): IBudgetManager {
    return this.budgetManager;
  }
  
  getExpenseManager(): IExpenseManager {
    return this.expenseManager;
  }
  
  getIncomeManager(): IIncomeManager {
    return this.incomeManager;
  }
  
  getCategoryManager(): ICategoryManager {
    return this.categoryManager;
  }
  
  getDashboardManager(): IDashboardManager {
    return this.dashboardManager;
  }
  
  getQueryManager(): IQueryManager {
    return this.queryManager;
  }
}
