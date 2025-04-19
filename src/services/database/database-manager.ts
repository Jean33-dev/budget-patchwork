
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

export class DatabaseManager extends DatabaseManagerImpl implements IDatabaseManager {
  private managerFactory: DatabaseManagerFactory;
  private customInitManager: InitializationDatabaseManager;
  private dataManager: DataOperationsManager;

  constructor() {
    super();
    this.managerFactory = new DatabaseManagerFactory();
    this.customInitManager = new InitializationDatabaseManager();
    this.dataManager = new DataOperationsManager();
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
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getDashboards");
        return [];
      }
      return this.managerFactory.getDashboardManager().getDashboards();
    } catch (error) {
      console.error("Error in getDashboards:", error);
      return [];
    }
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error("Database not initialized in getDashboardById");
      return null;
    }
    return this.managerFactory.getDashboardManager().getDashboardById(id);
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addDashboard");
    }
    await this.managerFactory.getDashboardManager().addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateDashboard");
    }
    await this.managerFactory.getDashboardManager().updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteDashboard");
    }
    await this.managerFactory.getDashboardManager().deleteDashboard(id);
  }

  // Budget methods
  async getBudgets(): Promise<Budget[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getBudgets");
        return [];
      }
      return this.managerFactory.getBudgetManager().getBudgets();
    } catch (error) {
      console.error("Error in getBudgets:", error);
      return [];
    }
  }

  async addBudget(budget: Budget): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addBudget");
    }
    await this.managerFactory.getBudgetManager().addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateBudget");
    }
    await this.managerFactory.getBudgetManager().updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteBudget");
    }
    await this.managerFactory.getBudgetManager().deleteBudget(id);
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getExpenses");
        return [];
      }
      return this.managerFactory.getExpenseManager().getExpenses();
    } catch (error) {
      console.error("Error in getExpenses:", error);
      return [];
    }
  }

  async getRecurringExpenses(): Promise<Expense[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getRecurringExpenses");
        return [];
      }
      return this.managerFactory.getExpenseManager().getRecurringExpenses();
    } catch (error) {
      console.error("Error in getRecurringExpenses:", error);
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addExpense");
    }
    await this.managerFactory.getExpenseManager().addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateExpense");
    }
    await this.managerFactory.getExpenseManager().updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteExpense");
    }
    await this.managerFactory.getExpenseManager().deleteExpense(id);
  }

  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in copyRecurringExpenseToMonth");
    }
    await this.managerFactory.getExpenseManager().copyRecurringExpenseToMonth(expenseId, targetDate);
  }

  // Income methods
  async getIncomes(): Promise<Income[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getIncomes");
        return [];
      }
      return this.managerFactory.getIncomeManager().getIncomes();
    } catch (error) {
      console.error("Error in getIncomes:", error);
      return [];
    }
  }

  async getRecurringIncomes(): Promise<Income[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getRecurringIncomes");
        return [];
      }
      return this.managerFactory.getIncomeManager().getRecurringIncomes();
    } catch (error) {
      console.error("Error in getRecurringIncomes:", error);
      return [];
    }
  }

  async addIncome(income: Income): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addIncome");
    }
    await this.managerFactory.getIncomeManager().addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateIncome");
    }
    await this.managerFactory.getIncomeManager().updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteIncome");
    }
    await this.managerFactory.getIncomeManager().deleteIncome(id);
  }

  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in copyRecurringIncomeToMonth");
    }
    await this.managerFactory.getIncomeManager().copyRecurringIncomeToMonth(incomeId, targetDate);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getCategories");
        return [];
      }
      return this.managerFactory.getCategoryManager().getCategories();
    } catch (error) {
      console.error("Error in getCategories:", error);
      return [];
    }
  }

  async addCategory(category: Category): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addCategory");
    }
    await this.managerFactory.getCategoryManager().addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateCategory");
    }
    await this.managerFactory.getCategoryManager().updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteCategory");
    }
    await this.managerFactory.getCategoryManager().deleteCategory(id);
  }

  async resetCategoryExpenses(categoryId: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in resetCategoryExpenses");
    }
    await this.managerFactory.getCategoryManager().resetCategoryExpenses(categoryId);
  }
}
