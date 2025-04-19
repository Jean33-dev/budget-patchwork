import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { Dashboard } from './models/dashboard';
import { DatabaseManagerImpl } from './database-manager-impl';
import { DatabaseManagerFactory } from './database-manager-factory';
import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { InitializationDatabaseManager } from './managers/initialization-manager';
import { DataOperationsManager } from './managers/data-operations-manager';
import { BudgetOperationsManager } from './managers/budget-operations-manager';
import { ExpenseOperationsManager } from './managers/expense-operations-manager';
import { IncomeOperationsManager } from './managers/income-operations-manager';
import { CategoryOperationsManager } from './managers/category-operations-manager';
import { DashboardOperationsManager } from './managers/dashboard-operations-manager';
import { TransitionOperationsManager } from './managers/transition-operations-manager';
import { SavedTransitionPreference } from "@/hooks/transition/useTransitionPreferencesGet";

export class DatabaseManager extends DatabaseManagerImpl implements IDatabaseManager {
  private managerFactory: DatabaseManagerFactory;
  private customInitManager: InitializationDatabaseManager;
  private dataManager: DataOperationsManager;
  private budgetManager: BudgetOperationsManager;
  private expenseManager: ExpenseOperationsManager;
  private incomeManager: IncomeOperationsManager;
  private categoryManager: CategoryOperationsManager;
  private dashboardManager: DashboardOperationsManager;
  private transitionManager: TransitionOperationsManager;

  constructor() {
    super();
    this.managerFactory = new DatabaseManagerFactory();
    this.customInitManager = new InitializationDatabaseManager();
    this.dataManager = new DataOperationsManager();
    this.budgetManager = new BudgetOperationsManager(this.ensureInitialized.bind(this), this.managerFactory);
    this.expenseManager = new ExpenseOperationsManager(this.ensureInitialized.bind(this), this.managerFactory);
    this.incomeManager = new IncomeOperationsManager(this.ensureInitialized.bind(this), this.managerFactory);
    this.categoryManager = new CategoryOperationsManager(this.ensureInitialized.bind(this), this.managerFactory);
    this.dashboardManager = new DashboardOperationsManager(this.ensureInitialized.bind(this), this.managerFactory);
    this.transitionManager = new TransitionOperationsManager(this.ensureInitialized.bind(this), this.managerFactory);
  }

  async init(): Promise<boolean> {
    const success = await this.customInitManager.init();
    
    if (success && this.db) {
      this.managerFactory.initializeManagers(this.db);
    }
    
    return success;
  }

  exportData() {
    return this.dataManager.exportData();
  }
  
  async migrateFromLocalStorage(): Promise<boolean> {
    return super.migrateFromLocalStorage();
  }
  
  resetInitializationAttempts(): void {
    this.customInitManager.resetInitializationAttempts();
  }

  async getDashboards(): Promise<Dashboard[]> {
    return this.dashboardManager.getDashboards();
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    return this.dashboardManager.getDashboardById(id);
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    return this.dashboardManager.addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    return this.dashboardManager.updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    return this.dashboardManager.deleteDashboard(id);
  }

  async getBudgets(): Promise<Budget[]> {
    return this.budgetManager.getBudgets();
  }

  async addBudget(budget: Budget): Promise<void> {
    return this.budgetManager.addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    return this.budgetManager.updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    return this.budgetManager.deleteBudget(id);
  }

  async getExpenses(): Promise<Expense[]> {
    return this.expenseManager.getExpenses();
  }

  async getRecurringExpenses(): Promise<Expense[]> {
    return this.expenseManager.getRecurringExpenses();
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.expenseManager.addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    return this.expenseManager.updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    return this.expenseManager.deleteExpense(id);
  }

  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    return this.expenseManager.copyRecurringExpenseToMonth(expenseId, targetDate);
  }

  async getIncomes(): Promise<Income[]> {
    return this.incomeManager.getIncomes();
  }

  async getRecurringIncomes(): Promise<Income[]> {
    return this.incomeManager.getRecurringIncomes();
  }

  async addIncome(income: Income): Promise<void> {
    return this.incomeManager.addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    return this.incomeManager.updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    return this.incomeManager.deleteIncome(id);
  }

  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    return this.incomeManager.copyRecurringIncomeToMonth(incomeId, targetDate);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryManager.getCategories();
  }

  async addCategory(category: Category): Promise<void> {
    return this.categoryManager.addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    return this.categoryManager.updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryManager.deleteCategory(id);
  }

  async resetCategoryExpenses(categoryId: string): Promise<void> {
    return this.categoryManager.resetCategoryExpenses(categoryId);
  }

  async getTransitionPreferences(): Promise<SavedTransitionPreference[] | null> {
    return this.transitionManager.getTransitionPreferences();
  }

  async saveTransitionPreferences(preferences: SavedTransitionPreference[]): Promise<boolean> {
    return this.transitionManager.saveTransitionPreferences(preferences);
  }
}
