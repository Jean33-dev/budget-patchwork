
import { Database } from 'sql.js';
import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { IQueryManager } from './interfaces/IQueryManager';
import { BudgetQueryManager } from './query-managers/budget-query-manager';
import { CategoryQueryManager } from './query-managers/category-query-manager';
import { ExpenseQueryManager } from './query-managers/expense-query-manager';
import { IncomeQueryManager } from './query-managers/income-query-manager';
import { DashboardQueryManager } from './query-managers/dashboard-query-manager';

export class QueryManager implements IQueryManager {
  private budgetQueryManager: BudgetQueryManager;
  private categoryQueryManager: CategoryQueryManager;
  private expenseQueryManager: ExpenseQueryManager;
  private incomeQueryManager: IncomeQueryManager;
  private dashboardQueryManager: DashboardQueryManager;
  private parent: IDatabaseManager | null = null;
  private db: Database | null = null;

  constructor(parent?: IDatabaseManager) {
    if (parent) {
      this.parent = parent;
    }
    this.budgetQueryManager = new BudgetQueryManager(this);
    this.categoryQueryManager = new CategoryQueryManager(this);
    this.expenseQueryManager = new ExpenseQueryManager(this);
    this.incomeQueryManager = new IncomeQueryManager(this);
    this.dashboardQueryManager = new DashboardQueryManager(this);
  }

  // Database access methods
  getDb(): Database {
    if (this.db) {
      return this.db;
    }
    if (this.parent) {
      return this.parent.getDb();
    }
    throw new Error('Database not initialized');
  }

  setDb(db: Database): void {
    console.log("Setting database in QueryManager");
    this.db = db;
  }

  ensureInitialized(): Promise<boolean> {
    if (this.db) {
      return Promise.resolve(true);
    }
    if (this.parent) {
      return this.parent.init().then(() => true).catch(() => false);
    }
    return Promise.resolve(false);
  }

  // Budget Operations
  async executeGetBudgets(): Promise<any[]> {
    try {
      return this.budgetQueryManager.getAll();
    } catch (error) {
      console.error("Error in executeGetBudgets:", error);
      throw error;
    }
  }

  async executeAddBudget(budget: any): Promise<void> {
    try {
      return this.budgetQueryManager.add(budget);
    } catch (error) {
      console.error("Error in executeAddBudget:", error);
      throw error;
    }
  }

  async executeUpdateBudget(budget: any): Promise<void> {
    try {
      return this.budgetQueryManager.update(budget);
    } catch (error) {
      console.error("Error in executeUpdateBudget:", error);
      throw error;
    }
  }

  async executeDeleteBudget(id: string): Promise<void> {
    try {
      return this.budgetQueryManager.delete(id);
    } catch (error) {
      console.error("Error in executeDeleteBudget:", error);
      throw error;
    }
  }

  // Category Operations
  async executeGetCategories(): Promise<any[]> {
    try {
      return this.categoryQueryManager.getAll();
    } catch (error) {
      console.error("Error in executeGetCategories:", error);
      throw error;
    }
  }

  async executeAddCategory(category: any): Promise<void> {
    try {
      return this.categoryQueryManager.add(category);
    } catch (error) {
      console.error("Error in executeAddCategory:", error);
      throw error;
    }
  }

  async executeUpdateCategory(category: any): Promise<void> {
    try {
      return this.categoryQueryManager.update(category);
    } catch (error) {
      console.error("Error in executeUpdateCategory:", error);
      throw error;
    }
  }

  async executeDeleteCategory(id: string): Promise<void> {
    try {
      return this.categoryQueryManager.delete(id);
    } catch (error) {
      console.error("Error in executeDeleteCategory:", error);
      throw error;
    }
  }

  // Expense Operations
  async executeGetExpenses(): Promise<any[]> {
    try {
      return this.expenseQueryManager.getAll();
    } catch (error) {
      console.error("Error in executeGetExpenses:", error);
      throw error;
    }
  }

  async executeGetRecurringExpenses(): Promise<any[]> {
    try {
      return this.expenseQueryManager.getRecurring();
    } catch (error) {
      console.error("Error in executeGetRecurringExpenses:", error);
      throw error;
    }
  }

  async executeAddExpense(expense: any): Promise<void> {
    try {
      return this.expenseQueryManager.add(expense);
    } catch (error) {
      console.error("Error in executeAddExpense:", error);
      throw error;
    }
  }

  async executeUpdateExpense(expense: any): Promise<void> {
    try {
      return this.expenseQueryManager.update(expense);
    } catch (error) {
      console.error("Error in executeUpdateExpense:", error);
      throw error;
    }
  }

  async executeDeleteExpense(id: string): Promise<void> {
    try {
      return this.expenseQueryManager.delete(id);
    } catch (error) {
      console.error("Error in executeDeleteExpense:", error);
      throw error;
    }
  }

  // Income Operations
  async executeGetIncomes(): Promise<any[]> {
    try {
      return this.incomeQueryManager.getAll();
    } catch (error) {
      console.error("Error in executeGetIncomes:", error);
      throw error;
    }
  }

  async executeGetRecurringIncomes(): Promise<any[]> {
    try {
      return this.incomeQueryManager.getRecurring();
    } catch (error) {
      console.error("Error in executeGetRecurringIncomes:", error);
      throw error;
    }
  }

  async executeAddIncome(income: any): Promise<void> {
    try {
      return this.incomeQueryManager.add(income);
    } catch (error) {
      console.error("Error in executeAddIncome:", error);
      throw error;
    }
  }

  async executeUpdateIncome(income: any): Promise<void> {
    try {
      return this.incomeQueryManager.update(income);
    } catch (error) {
      console.error("Error in executeUpdateIncome:", error);
      throw error;
    }
  }

  async executeDeleteIncome(id: string): Promise<void> {
    try {
      return this.incomeQueryManager.delete(id);
    } catch (error) {
      console.error("Error in executeDeleteIncome:", error);
      throw error;
    }
  }

  // Dashboard Operations
  async executeGetDashboards(): Promise<any[]> {
    try {
      return this.dashboardQueryManager.getAll();
    } catch (error) {
      console.error("Error in executeGetDashboards:", error);
      throw error;
    }
  }

  async executeAddDashboard(dashboard: any): Promise<void> {
    try {
      return this.dashboardQueryManager.add(dashboard);
    } catch (error) {
      console.error("Error in executeAddDashboard:", error);
      throw error;
    }
  }

  async executeUpdateDashboard(dashboard: any): Promise<void> {
    try {
      return this.dashboardQueryManager.update(dashboard);
    } catch (error) {
      console.error("Error in executeUpdateDashboard:", error);
      throw error;
    }
  }

  async executeDeleteDashboard(id: string): Promise<void> {
    try {
      return this.dashboardQueryManager.delete(id);
    } catch (error) {
      console.error("Error in executeDeleteDashboard:", error);
      throw error;
    }
  }
}
