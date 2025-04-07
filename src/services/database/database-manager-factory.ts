
import { BudgetManager } from './managers/budget-manager';
import { ExpenseManager } from './managers/expense-manager';
import { IncomeManager } from './managers/income-manager';
import { CategoryManager } from './managers/category-manager';
import { FixedIncomeManager } from './managers/fixed-income-manager';
import { FixedExpenseManager } from './managers/fixed-expense-manager';
import { QueryManager } from './query-manager';
import { IBudgetManager } from './interfaces/IBudgetManager';
import { IExpenseManager } from './interfaces/IExpenseManager';
import { IIncomeManager } from './interfaces/IIncomeManager';
import { ICategoryManager } from './interfaces/ICategoryManager';
import { IFixedIncomeManager } from './interfaces/IFixedIncomeManager';
import { IFixedExpenseManager } from './interfaces/IFixedExpenseManager';
import { IQueryManager } from './interfaces/IQueryManager';

/**
 * Factory that creates and coordinates all specialized database managers
 */
export class DatabaseManagerFactory {
  private budgetManager: IBudgetManager;
  private expenseManager: IExpenseManager;
  private incomeManager: IIncomeManager;
  private categoryManager: ICategoryManager;
  private fixedIncomeManager: IFixedIncomeManager;
  private fixedExpenseManager: IFixedExpenseManager;
  private queryManager: IQueryManager;
  
  constructor() {
    this.queryManager = new QueryManager();
    this.budgetManager = new BudgetManager();
    this.expenseManager = new ExpenseManager();
    this.incomeManager = new IncomeManager();
    this.categoryManager = new CategoryManager();
    this.fixedIncomeManager = new FixedIncomeManager();
    this.fixedExpenseManager = new FixedExpenseManager();
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
    this.fixedIncomeManager.setDb(dbInstance);
    this.fixedExpenseManager.setDb(dbInstance);
    
    // Set all managers as initialized
    this.budgetManager.setInitialized(true);
    this.expenseManager.setInitialized(true);
    this.incomeManager.setInitialized(true);
    this.categoryManager.setInitialized(true);
    this.fixedIncomeManager.setInitialized(true);
    this.fixedExpenseManager.setInitialized(true);
    
    // Ensure all managers have a query manager reference
    this.budgetManager.setQueryManager(this.queryManager);
    this.expenseManager.setQueryManager(this.queryManager);
    this.incomeManager.setQueryManager(this.queryManager);
    this.categoryManager.setQueryManager(this.queryManager);
    this.fixedIncomeManager.setQueryManager(this.queryManager);
    this.fixedExpenseManager.setQueryManager(this.queryManager);
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
  
  getFixedIncomeManager(): IFixedIncomeManager {
    return this.fixedIncomeManager;
  }
  
  getFixedExpenseManager(): IFixedExpenseManager {
    return this.fixedExpenseManager;
  }
  
  getQueryManager(): IQueryManager {
    return this.queryManager;
  }
}
