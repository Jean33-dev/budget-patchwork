
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { BaseDatabaseManager } from './base-database-manager';
import { DatabaseInitManager } from './database-init-manager';
import { DatabaseManagerImpl } from './database-manager-impl';
import { DatabaseManagerFactory } from './database-manager-factory';

export class DatabaseManager extends DatabaseManagerImpl {
  private managerFactory: DatabaseManagerFactory;

  constructor() {
    super();
    this.managerFactory = new DatabaseManagerFactory();
  }

  async init(): Promise<boolean> {
    // Call the parent implementation to initialize the core database
    const success = await super.init();
    
    if (success && this.db) {
      // Initialize all the specialized managers with the database instance
      this.managerFactory.initializeManagers(this.db);
    }
    
    return success;
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

  async addBudget(budget: Budget) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addBudget");
    }
    await this.managerFactory.getBudgetManager().addBudget(budget);
  }

  async updateBudget(budget: Budget) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateBudget");
    }
    await this.managerFactory.getBudgetManager().updateBudget(budget);
  }

  async deleteBudget(id: string) {
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

  async addExpense(expense: Expense) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addExpense");
    }
    await this.managerFactory.getExpenseManager().addExpense(expense);
  }

  async updateExpense(expense: Expense) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateExpense");
    }
    await this.managerFactory.getExpenseManager().updateExpense(expense);
  }

  async deleteExpense(id: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteExpense");
    }
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.managerFactory.getExpenseManager().deleteExpense(id);
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

  async addIncome(income: Income) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addIncome");
    }
    await this.managerFactory.getIncomeManager().addIncome(income);
  }

  async updateIncome(income: Income) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateIncome");
    }
    await this.managerFactory.getIncomeManager().updateIncome(income);
  }

  async deleteIncome(id: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteIncome");
    }
    await this.managerFactory.getIncomeManager().deleteIncome(id);
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

  async addCategory(category: Category) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addCategory");
    }
    await this.managerFactory.getCategoryManager().addCategory(category);
  }

  async updateCategory(category: Category) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateCategory");
    }
    await this.managerFactory.getCategoryManager().updateCategory(category);
  }

  async deleteCategory(id: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteCategory");
    }
    await this.managerFactory.getCategoryManager().deleteCategory(id);
  }

  async resetCategoryExpenses(categoryId: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in resetCategoryExpenses");
    }
    await this.managerFactory.getCategoryManager().resetCategoryExpenses(categoryId);
  }
}
