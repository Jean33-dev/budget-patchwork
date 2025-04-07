import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { FixedExpense } from './models/fixedExpense';
import { FixedIncome } from './models/fixedIncome';
import { BaseDatabaseManager } from './base-database-manager';
import { DatabaseManagerImpl } from './database-manager-impl';
import { DatabaseManagerFactory } from './database-manager-factory';
import { IDatabaseManager } from './interfaces/IDatabaseManager';

export class DatabaseManager extends DatabaseManagerImpl implements IDatabaseManager {
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

  async addExpense(expense: Expense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addExpense");
    }
    await this.managerFactory.getExpenseManager().addExpense(expense);
    
    // Si c'est une dépense fixe, l'ajouter aussi dans la table des dépenses fixes
    if (expense.isFixed) {
      const fixedExpense: FixedExpense = {
        id: expense.id,
        title: expense.title,
        budget: expense.budget,
        type: "expense",
        linkedBudgetId: expense.linkedBudgetId,
        date: expense.date
      };
      await this.addFixedExpense(fixedExpense);
    }
  }

  async updateExpense(expense: Expense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateExpense");
    }
    await this.managerFactory.getExpenseManager().updateExpense(expense);
    
    // Si c'est une dépense fixe, mettre à jour aussi dans la table des dépenses fixes
    if (expense.isFixed) {
      const fixedExpense: FixedExpense = {
        id: expense.id,
        title: expense.title,
        budget: expense.budget,
        type: "expense",
        linkedBudgetId: expense.linkedBudgetId,
        date: expense.date
      };
      await this.updateFixedExpense(fixedExpense);
    } else {
      // Si ce n'est plus une dépense fixe mais qu'elle l'était avant, la supprimer de la table des fixes
      await this.deleteFixedExpenseIfExists(expense.id);
    }
  }

  async deleteExpense(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteExpense");
    }
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.managerFactory.getExpenseManager().deleteExpense(id);
    
    // Supprimer aussi de la table des dépenses fixes si elle y est
    await this.deleteFixedExpenseIfExists(id);
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

  async addIncome(income: Income): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addIncome");
    }
    await this.managerFactory.getIncomeManager().addIncome(income);
    
    // Si c'est un revenu fixe, l'ajouter aussi dans la table des revenus fixes
    if (income.isFixed) {
      const fixedIncome: FixedIncome = {
        id: income.id,
        title: income.title,
        budget: income.budget,
        type: "income",
        date: income.date
      };
      await this.addFixedIncome(fixedIncome);
    }
  }

  async updateIncome(income: Income): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateIncome");
    }
    await this.managerFactory.getIncomeManager().updateIncome(income);
    
    // Si c'est un revenu fixe, mettre à jour aussi dans la table des revenus fixes
    if (income.isFixed) {
      const fixedIncome: FixedIncome = {
        id: income.id,
        title: income.title,
        budget: income.budget,
        type: "income",
        date: income.date
      };
      await this.updateFixedIncome(fixedIncome);
    } else {
      // Si ce n'est plus un revenu fixe mais qu'il l'était avant, le supprimer de la table des fixes
      await this.deleteFixedIncomeIfExists(income.id);
    }
  }

  async deleteIncome(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteIncome");
    }
    await this.managerFactory.getIncomeManager().deleteIncome(id);
    
    // Supprimer aussi de la table des revenus fixes si il y est
    await this.deleteFixedIncomeIfExists(id);
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

  // Fixed Expense methods
  async getFixedExpenses(): Promise<FixedExpense[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getFixedExpenses");
        return [];
      }
      return this.managerFactory.getFixedExpenseManager().getFixedExpenses();
    } catch (error) {
      console.error("Error in getFixedExpenses:", error);
      return [];
    }
  }

  async addFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addFixedExpense");
    }
    await this.managerFactory.getFixedExpenseManager().addFixedExpense(fixedExpense);
  }

  async updateFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateFixedExpense");
    }
    await this.managerFactory.getFixedExpenseManager().updateFixedExpense(fixedExpense);
  }

  async deleteFixedExpense(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteFixedExpense");
    }
    await this.managerFactory.getFixedExpenseManager().deleteFixedExpense(id);
  }
  
  async deleteFixedExpenseIfExists(id: string): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) return;
      
      await this.managerFactory.getFixedExpenseManager().deleteFixedExpenseIfExists(id);
    } catch (error) {
      console.error(`Error checking and deleting fixed expense ${id}:`, error);
    }
  }
  
  async updateFixedExpensesDates(newDate: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateFixedExpensesDates");
    }
    await this.managerFactory.getFixedExpenseManager().updateFixedExpensesDates(newDate);
  }

  // Fixed Income methods
  async getFixedIncomes(): Promise<FixedIncome[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getFixedIncomes");
        return [];
      }
      return this.managerFactory.getFixedIncomeManager().getFixedIncomes();
    } catch (error) {
      console.error("Error in getFixedIncomes:", error);
      return [];
    }
  }

  async addFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addFixedIncome");
    }
    await this.managerFactory.getFixedIncomeManager().addFixedIncome(fixedIncome);
  }

  async updateFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateFixedIncome");
    }
    await this.managerFactory.getFixedIncomeManager().updateFixedIncome(fixedIncome);
  }

  async deleteFixedIncome(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteFixedIncome");
    }
    await this.managerFactory.getFixedIncomeManager().deleteFixedIncome(id);
  }
  
  async deleteFixedIncomeIfExists(id: string): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) return;
      
      await this.managerFactory.getFixedIncomeManager().deleteFixedIncomeIfExists(id);
    } catch (error) {
      console.error(`Error checking and deleting fixed income ${id}:`, error);
    }
  }
  
  async updateFixedIncomesDates(newDate: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateFixedIncomesDates");
    }
    await this.managerFactory.getFixedIncomeManager().updateFixedIncomesDates(newDate);
  }
}
