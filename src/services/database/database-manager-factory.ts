
import { BudgetManager } from './managers/budget-manager';
import { ExpenseManager } from './managers/expense-manager';
import { IncomeManager } from './managers/income-manager';
import { CategoryManager } from './managers/category-manager';
import { QueryManager } from './query-manager';

/**
 * Factory that creates and coordinates all specialized database managers
 */
export class DatabaseManagerFactory {
  private budgetManager: BudgetManager;
  private expenseManager: ExpenseManager;
  private incomeManager: IncomeManager;
  private categoryManager: CategoryManager;
  private queryManager: QueryManager;
  
  constructor() {
    this.queryManager = new QueryManager();
    this.budgetManager = new BudgetManager();
    this.expenseManager = new ExpenseManager();
    this.incomeManager = new IncomeManager();
    this.categoryManager = new CategoryManager();
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
    
    // Set all managers as initialized
    this.budgetManager.setInitialized(true);
    this.expenseManager.setInitialized(true);
    this.incomeManager.setInitialized(true);
    this.categoryManager.setInitialized(true);
    
    // Ensure all managers have a query manager reference
    this.budgetManager.setQueryManager(this.queryManager);
    this.expenseManager.setQueryManager(this.queryManager);
    this.incomeManager.setQueryManager(this.queryManager);
    this.categoryManager.setQueryManager(this.queryManager);
  }
  
  getBudgetManager(): BudgetManager {
    return this.budgetManager;
  }
  
  getExpenseManager(): ExpenseManager {
    return this.expenseManager;
  }
  
  getIncomeManager(): IncomeManager {
    return this.incomeManager;
  }
  
  getCategoryManager(): CategoryManager {
    return this.categoryManager;
  }
  
  getQueryManager(): QueryManager {
    return this.queryManager;
  }
}
