
import { toast } from "@/components/ui/use-toast";
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { BaseDatabaseManager } from './base-database-manager';
import { DatabaseInitManager } from './database-init-manager';
import { DatabaseManagerCore } from './database-manager-core';
import { BudgetManager } from './managers/budget-manager';
import { ExpenseManager } from './managers/expense-manager';
import { IncomeManager } from './managers/income-manager';
import { CategoryManager } from './managers/category-manager';

export class DatabaseManager extends DatabaseManagerCore {
  private initManager: DatabaseInitManager;
  private budgetManager: BudgetManager;
  private expenseManager: ExpenseManager;
  private incomeManager: IncomeManager;
  private categoryManager: CategoryManager;
  private static initializationInProgress = false;

  constructor() {
    super();
    this.initManager = new DatabaseInitManager();
    this.budgetManager = new BudgetManager();
    this.expenseManager = new ExpenseManager();
    this.incomeManager = new IncomeManager();
    this.categoryManager = new CategoryManager();
  }

  async init(): Promise<boolean> {
    // If already initialized, return true
    if (this.initialized && this.db) {
      return true;
    }
    
    // Prevent concurrent initialization
    if (DatabaseManager.initializationInProgress) {
      console.log("DatabaseManager initialization already in progress, waiting...");
      while (DatabaseManager.initializationInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      // Check if initialization was successful
      if (this.initialized && this.db) {
        return true;
      }
    }
    
    DatabaseManager.initializationInProgress = true;
    
    try {
      // First initialize the core
      console.log("Initializing database core...");
      const coreSuccess = await super.init();
      if (!coreSuccess) {
        console.error("Failed to initialize database core");
        return false;
      }
      
      try {
        // Initialize the database using the init manager
        console.log("Initializing database using init manager...");
        const success = await this.initManager.init();
        
        if (!success) {
          console.error("Failed to initialize database with init manager");
          return false;
        }
        
        // Share the database instance with all managers
        const dbInstance = this.initManager.getDb();
        if (!dbInstance) {
          console.error("Database instance is null after initialization");
          return false;
        }
        
        // Set the database instance for all managers
        this.budgetManager.setDb(dbInstance);
        this.expenseManager.setDb(dbInstance);
        this.incomeManager.setDb(dbInstance);
        this.categoryManager.setDb(dbInstance);
        
        // Set all managers as initialized
        this.budgetManager.setInitialized(true);
        this.expenseManager.setInitialized(true);
        this.incomeManager.setInitialized(true);
        this.categoryManager.setInitialized(true);
        
        // Ensure all managers have a query manager reference
        if (this.queryManager) {
          this.budgetManager.setQueryManager(this.queryManager);
          this.expenseManager.setQueryManager(this.queryManager);
          this.incomeManager.setQueryManager(this.queryManager);
          this.categoryManager.setQueryManager(this.queryManager);
        }
        
        return true;
      } catch (err) {
        console.error('Error initializing database managers:', err);
        toast({
          variant: "destructive",
          title: "Database error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        return false;
      }
    } finally {
      DatabaseManager.initializationInProgress = false;
    }
  }
  
  // Méthode pour réinitialiser le compteur de tentatives
  resetInitializationAttempts(): void {
    BaseDatabaseManager.resetInitializationAttempts();
  }

  // Delegate methods to the appropriate managers
  
  // Budget methods
  async getBudgets(): Promise<Budget[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getBudgets");
        return [];
      }
      return this.budgetManager.getBudgets();
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
    await this.budgetManager.addBudget(budget);
  }

  async updateBudget(budget: Budget) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateBudget");
    }
    await this.budgetManager.updateBudget(budget);
  }

  async deleteBudget(id: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteBudget");
    }
    await this.budgetManager.deleteBudget(id);
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getExpenses");
        return [];
      }
      return this.expenseManager.getExpenses();
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
    await this.expenseManager.addExpense(expense);
  }

  async updateExpense(expense: Expense) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateExpense");
    }
    await this.expenseManager.updateExpense(expense);
  }

  async deleteExpense(id: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteExpense");
    }
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.expenseManager.deleteExpense(id);
  }

  // Income methods
  async getIncomes(): Promise<Income[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getIncomes");
        return [];
      }
      return this.incomeManager.getIncomes();
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
    await this.incomeManager.addIncome(income);
  }

  async updateIncome(income: Income) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateIncome");
    }
    await this.incomeManager.updateIncome(income);
  }

  async deleteIncome(id: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteIncome");
    }
    await this.incomeManager.deleteIncome(id);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getCategories");
        return [];
      }
      return this.categoryManager.getCategories();
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
    await this.categoryManager.addCategory(category);
  }

  async updateCategory(category: Category) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateCategory");
    }
    await this.categoryManager.updateCategory(category);
  }

  async deleteCategory(id: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteCategory");
    }
    await this.categoryManager.deleteCategory(id);
  }

  async resetCategoryExpenses(categoryId: string) {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in resetCategoryExpenses");
    }
    await this.categoryManager.resetCategoryExpenses(categoryId);
  }

  async migrateFromLocalStorage() {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in migrateFromLocalStorage");
    }
    await this.initManager.migrateFromLocalStorage();
  }
}
