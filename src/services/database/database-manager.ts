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
import { PinManager } from './managers/pin-manager';

export class DatabaseManager extends DatabaseManagerImpl implements IDatabaseManager {
  private managerFactory: DatabaseManagerFactory;
  private customInitManager: InitializationDatabaseManager;
  private dataManager: DataOperationsManager;
  private budgetManager: BudgetOperationsManager;
  private expenseManager: ExpenseOperationsManager;
  private incomeManager: IncomeOperationsManager;
  private categoryManager: CategoryOperationsManager;
  private dashboardManager: DashboardOperationsManager;
  private pinManager: PinManager;

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
    this.pinManager = this.managerFactory.getPinManager();
  }

  async init(): Promise<boolean> {
    // Use our custom initialization manager instead of the parent's
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
    // Delegate to the implementation in DatabaseManagerImpl
    return super.migrateFromLocalStorage();
  }
  
  // Override resetInitializationAttempts to delegate to the customInitManager
  resetInitializationAttempts(): void {
    this.customInitManager.resetInitializationAttempts();
  }

  // Dashboard methods
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

  // Budget methods
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

  // Expense methods
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

  // Income methods
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

  // Category methods
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

  // PIN management
  async setPin(pin: string) {
    await this.pinManager.setPin(pin);
  }
  async clearPin() {
    await this.pinManager.clearPin();
  }
  async lockApp() {
    await this.pinManager.lockApp();
  }
  async unlockApp() {
    await this.pinManager.unlockApp();
  }
  async isLocked(): Promise<boolean> {
    return this.pinManager.isLocked();
  }
  async hasPin(): Promise<boolean> {
    return this.pinManager.hasPin();
  }
  async verifyPin(input: string): Promise<boolean> {
    return this.pinManager.verifyPin(input);
  }
}
