
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
  async init(): Promise<boolean> {
    try {
      console.log("DatabaseService: Initializing database...");
      return await this.manager.init();
    } catch (error) {
      console.error("DatabaseService: Error during initialization:", error);
      return false;
    }
  }

  /**
   * Reset initialization attempts
   */
  resetInitializationAttempts(): void {
    console.log("DatabaseService: Resetting initialization attempts");
    this.manager.resetInitializationAttempts?.();
  }

  /**
   * Safely add a dashboard (doesn't throw exceptions)
   */
  async safeAddDashboard(dashboard: Dashboard): Promise<boolean> {
    try {
      console.log(`DatabaseService: Safely adding dashboard: ${dashboard.id}`);
      return await this.manager.safeAddDashboard(dashboard);
    } catch (error) {
      console.error("DatabaseService: Error in safeAddDashboard:", error);
      return false;
    }
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

  async getRecurringExpenses(): Promise<Expense[]> {
    return this.manager.getExpenseManager().getRecurringExpenses();
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

  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    return this.manager.getExpenseManager().copyRecurringExpenseToMonth(expenseId, targetDate);
  }

  /* Income Methods */
  async getIncomes(): Promise<Income[]> {
    return this.manager.getIncomeManager().getIncomes();
  }

  async getRecurringIncomes(): Promise<Income[]> {
    return this.manager.getIncomeManager().getRecurringIncomes();
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

  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    return this.manager.getIncomeManager().copyRecurringIncomeToMonth(incomeId, targetDate);
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

// Export as a named constant 'databaseService'
export const databaseService = new DatabaseService();
// Also export as 'db' for backward compatibility
export const db = databaseService;
