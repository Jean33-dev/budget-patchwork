
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
  private parent: IDatabaseManager;

  constructor(parent: IDatabaseManager) {
    this.parent = parent;
    this.budgetQueryManager = new BudgetQueryManager(this);
    this.categoryQueryManager = new CategoryQueryManager(this);
    this.expenseQueryManager = new ExpenseQueryManager(this);
    this.incomeQueryManager = new IncomeQueryManager(this);
    this.dashboardQueryManager = new DashboardQueryManager(this);
  }

  // Database access methods
  getDb(): Database {
    return this.parent.getDb();
  }

  ensureInitialized(): Promise<boolean> {
    if (!this.parent.isDbInitialized()) {
      return this.parent.init().then(() => true).catch(() => false);
    }
    return Promise.resolve(true);
  }

  // Budget Operations
  async executeGetBudgets(): Promise<any[]> {
    return this.budgetQueryManager.getAll();
  }

  async executeAddBudget(budget: any): Promise<void> {
    return this.budgetQueryManager.add(budget);
  }

  async executeUpdateBudget(budget: any): Promise<void> {
    return this.budgetQueryManager.update(budget);
  }

  async executeDeleteBudget(id: string): Promise<void> {
    return this.budgetQueryManager.delete(id);
  }

  // Category Operations
  async executeGetCategories(): Promise<any[]> {
    return this.categoryQueryManager.getAll();
  }

  async executeAddCategory(category: any): Promise<void> {
    return this.categoryQueryManager.add(category);
  }

  async executeUpdateCategory(category: any): Promise<void> {
    return this.categoryQueryManager.update(category);
  }

  async executeDeleteCategory(id: string): Promise<void> {
    return this.categoryQueryManager.delete(id);
  }

  // Expense Operations
  async executeGetExpenses(): Promise<any[]> {
    return this.expenseQueryManager.getAll();
  }

  async executeAddExpense(expense: any): Promise<void> {
    return this.expenseQueryManager.add(expense);
  }

  async executeUpdateExpense(expense: any): Promise<void> {
    return this.expenseQueryManager.update(expense);
  }

  async executeDeleteExpense(id: string): Promise<void> {
    return this.expenseQueryManager.delete(id);
  }

  // Income Operations
  async executeGetIncomes(): Promise<any[]> {
    return this.incomeQueryManager.getAll();
  }

  async executeAddIncome(income: any): Promise<void> {
    return this.incomeQueryManager.add(income);
  }

  async executeUpdateIncome(income: any): Promise<void> {
    return this.incomeQueryManager.update(income);
  }

  async executeDeleteIncome(id: string): Promise<void> {
    return this.incomeQueryManager.delete(id);
  }

  // Dashboard Operations
  async executeGetDashboards(): Promise<any[]> {
    return this.dashboardQueryManager.getAll();
  }

  async executeAddDashboard(dashboard: any): Promise<void> {
    return this.dashboardQueryManager.add(dashboard);
  }

  async executeUpdateDashboard(dashboard: any): Promise<void> {
    return this.dashboardQueryManager.update(dashboard);
  }

  async executeDeleteDashboard(id: string): Promise<void> {
    return this.dashboardQueryManager.delete(id);
  }
}
