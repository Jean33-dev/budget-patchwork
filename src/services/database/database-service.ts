
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { Dashboard } from './models/dashboard';
import { IncomeService } from './services/income-service';
import { ExpenseService } from './services/expense-service';
import { BudgetService } from './services/budget-service';
import { CategoryService } from './services/category-service';
import { DashboardService } from './services/dashboard-service';
import { SavedTransitionPreference } from '@/hooks/transition/useTransitionPreferencesGet';

/**
 * Main database service that uses specialized service classes for each entity
 */
class DatabaseService {
  private incomeService: IncomeService;
  private expenseService: ExpenseService;
  private budgetService: BudgetService;
  private categoryService: CategoryService;
  private dashboardService: DashboardService;

  constructor() {
    this.incomeService = new IncomeService();
    this.expenseService = new ExpenseService();
    this.budgetService = new BudgetService();
    this.categoryService = new CategoryService();
    this.dashboardService = new DashboardService();
  }

  /**
   * Initializes the database
   */
  async init(): Promise<boolean> {
    // Initialize all services with the same database
    const success = await this.incomeService.init();
    // Other services will use the same database instance
    return success;
  }

  /**
   * Resets the counter of initialization attempts
   */
  resetInitializationAttempts(): void {
    this.incomeService.resetInitializationAttempts();
  }

  // Income methods delegated to IncomeService
  async getIncomes(): Promise<Income[]> {
    return this.incomeService.getIncomes();
  }

  async getRecurringIncomes(): Promise<Income[]> {
    return this.incomeService.getRecurringIncomes();
  }

  async addIncome(income: Income): Promise<void> {
    return this.incomeService.addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    return this.incomeService.updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    return this.incomeService.deleteIncome(id);
  }

  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    return this.incomeService.copyRecurringIncomeToMonth(incomeId, targetDate);
  }

  // Expense methods delegated to ExpenseService
  async getExpenses(): Promise<Expense[]> {
    return this.expenseService.getExpenses();
  }

  async getRecurringExpenses(): Promise<Expense[]> {
    return this.expenseService.getRecurringExpenses();
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.expenseService.addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    return this.expenseService.updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    return this.expenseService.deleteExpense(id);
  }

  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    return this.expenseService.copyRecurringExpenseToMonth(expenseId, targetDate);
  }

  // Budget methods delegated to BudgetService
  async getBudgets(): Promise<Budget[]> {
    return this.budgetService.getBudgets();
  }

  async addBudget(budget: Budget): Promise<void> {
    return this.budgetService.addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    return this.budgetService.updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    return this.budgetService.deleteBudget(id);
  }

  // Category methods delegated to CategoryService
  async getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }

  async addCategory(category: Category): Promise<void> {
    return this.categoryService.addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    return this.categoryService.updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }

  // Dashboard methods delegated to DashboardService
  async getDashboards(): Promise<Dashboard[]> {
    return this.dashboardService.getDashboards();
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    return this.dashboardService.getDashboardById(id);
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    return this.dashboardService.addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    return this.dashboardService.updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    return this.dashboardService.deleteDashboard(id);
  }

  /**
   * Gets transition preferences from the database
   */
  async getTransitionPreferences(): Promise<SavedTransitionPreference[] | null> {
    return this.incomeService.getTransitionPreferences();
  }

  /**
   * Saves transition preferences to the database
   */
  async saveTransitionPreferences(preferences: SavedTransitionPreference[]): Promise<boolean> {
    return this.incomeService.saveTransitionPreferences(preferences);
  }

  /**
   * Exports database data
   */
  exportData(): Uint8Array | null {
    return this.incomeService.exportData();
  }

  /**
   * Imports data into the database
   */
  importData(data: Uint8Array): boolean {
    return this.incomeService.importData(data);
  }
}

// Export a singleton instance of the database service
export const databaseService = new DatabaseService();
