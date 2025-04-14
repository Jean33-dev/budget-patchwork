
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { Dashboard } from './models/dashboard';
import { BaseDatabaseManager } from './base-database-manager';
import { DatabaseManagerImpl } from './database-manager-impl';
import { DatabaseManagerFactory } from './database-manager-factory';
import { IDatabaseManager } from './interfaces/IDatabaseManager';

export class DatabaseManager extends DatabaseManagerImpl implements IDatabaseManager {
  constructor() {
    super();
  }

  async init(): Promise<boolean> {
    // Call the parent implementation to initialize the core database
    return await super.init();
  }

  // Budget methods
  async getBudgets(): Promise<Budget[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      return this.getBudgetManager().getBudgets();
    } catch (error) {
      console.error("Error in getBudgets:", error);
      return [];
    }
  }

  async addBudget(budget: Budget): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getBudgetManager().addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getBudgetManager().updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getBudgetManager().deleteBudget(id);
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      return this.getExpenseManager().getExpenses();
    } catch (error) {
      console.error("Error in getExpenses:", error);
      return [];
    }
  }

  async getRecurringExpenses(): Promise<Expense[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      return this.getExpenseManager().getRecurringExpenses();
    } catch (error) {
      console.error("Error in getRecurringExpenses:", error);
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getExpenseManager().addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getExpenseManager().updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.getExpenseManager().deleteExpense(id);
  }

  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getExpenseManager().copyRecurringExpenseToMonth(expenseId, targetDate);
  }

  // Income methods
  async getIncomes(): Promise<Income[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      return this.getIncomeManager().getIncomes();
    } catch (error) {
      console.error("Error in getIncomes:", error);
      return [];
    }
  }

  async getRecurringIncomes(): Promise<Income[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      return this.getIncomeManager().getRecurringIncomes();
    } catch (error) {
      console.error("Error in getRecurringIncomes:", error);
      return [];
    }
  }

  async addIncome(income: Income): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getIncomeManager().addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getIncomeManager().updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getIncomeManager().deleteIncome(id);
  }

  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getIncomeManager().copyRecurringIncomeToMonth(incomeId, targetDate);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      return this.getCategoryManager().getCategories();
    } catch (error) {
      console.error("Error in getCategories:", error);
      return [];
    }
  }

  async addCategory(category: Category): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getCategoryManager().addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getCategoryManager().updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getCategoryManager().deleteCategory(id);
  }

  async resetCategoryExpenses(categoryId: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getCategoryManager().resetCategoryExpenses(categoryId);
  }

  // Dashboard methods
  async getDashboards(): Promise<Dashboard[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      return this.getDashboardManager().getDashboards();
    } catch (error) {
      console.error("Error in getDashboards:", error);
      return [];
    }
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getDashboardManager().addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getDashboardManager().updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    await this.getDashboardManager().deleteDashboard(id);
  }
}
