
import { Income } from '../models/income';
import { Expense } from '../models/expense';
import { Budget } from '../models/budget';
import { Category } from '../models/category';
import { Dashboard } from '../models/dashboard';
import { IncomeService } from './income-service';
import { ExpenseService } from './expense-service';
import { BudgetService } from './budget-service';
import { CategoryService } from './category-service';
import { DashboardService } from './dashboard-service';
import { DataExportManager } from '../data-export-manager';

export class DatabaseServiceCoordinator {
  private incomeService: IncomeService;
  private expenseService: ExpenseService;
  private budgetService: BudgetService;
  private categoryService: CategoryService;
  private dashboardService: DashboardService;
  private dataExportManager: DataExportManager | null = null;

  constructor() {
    this.incomeService = new IncomeService();
    this.expenseService = new ExpenseService();
    this.budgetService = new BudgetService();
    this.categoryService = new CategoryService();
    this.dashboardService = new DashboardService();
  }

  async init(): Promise<boolean> {
    const success = await this.incomeService.init();
    
    if (success) {
      const adapter = this.incomeService.getAdapter?.();
      if (adapter) {
        this.dataExportManager = new DataExportManager(adapter);
      }
    }
    
    return success;
  }

  resetInitializationAttempts(): void {
    this.incomeService.resetInitializationAttempts();
  }

  async migrateFromLocalStorage(): Promise<boolean> {
    if (!this.dataExportManager) {
      const initialized = await this.init();
      if (!initialized) {
        return false;
      }
      
      const adapter = this.incomeService.getAdapter?.();
      if (adapter) {
        this.dataExportManager = new DataExportManager(adapter);
      }
    }
    
    if (this.dataExportManager) {
      return await this.dataExportManager.migrateFromLocalStorage();
    }
    
    return false;
  }

  // Income methods
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

  // Expense methods
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

  // Budget methods
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

  // Category methods
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

  // Dashboard methods
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

  // Data export methods
  exportData(): Uint8Array | null {
    return this.incomeService.exportData();
  }

  importData(data: Uint8Array): boolean {
    return this.incomeService.importData(data);
  }
}
