
import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { DatabaseManagerFactory } from './database-manager-factory';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { Expense } from './models/expense';
import { Income } from './models/income';
import { Dashboard } from './models/dashboard';

class DatabaseService {
  private manager: IDatabaseManager;

  constructor() {
    this.manager = DatabaseManagerFactory.getDatabaseManager();
  }

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    return this.manager.init();
  }

  /* Budget Methods */
  async getBudgets(): Promise<Budget[]> {
    return this.manager.getBudgetManager().getBudgets();
  }

  async addBudget(budget: Budget): Promise<void> {
    return this.manager.getBudgetManager().addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    return this.manager.getBudgetManager().updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    return this.manager.getBudgetManager().deleteBudget(id);
  }

  /* Category Methods */
  async getCategories(): Promise<Category[]> {
    return this.manager.getCategoryManager().getCategories();
  }

  async addCategory(category: Category): Promise<void> {
    return this.manager.getCategoryManager().addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    return this.manager.getCategoryManager().updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.manager.getCategoryManager().deleteCategory(id);
  }

  /* Expense Methods */
  async getExpenses(): Promise<Expense[]> {
    return this.manager.getExpenseManager().getExpenses();
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.manager.getExpenseManager().addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    return this.manager.getExpenseManager().updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    return this.manager.getExpenseManager().deleteExpense(id);
  }

  /* Income Methods */
  async getIncomes(): Promise<Income[]> {
    return this.manager.getIncomeManager().getIncomes();
  }

  async addIncome(income: Income): Promise<void> {
    return this.manager.getIncomeManager().addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    return this.manager.getIncomeManager().updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    return this.manager.getIncomeManager().deleteIncome(id);
  }

  /* Dashboard Methods */
  async getDashboards(): Promise<Dashboard[]> {
    return this.manager.getDashboardManager().getDashboards();
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    return this.manager.getDashboardManager().addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    return this.manager.getDashboardManager().updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    return this.manager.getDashboardManager().deleteDashboard(id);
  }
}

export const db = new DatabaseService();
