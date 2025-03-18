
import { toast } from "@/components/ui/use-toast";
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseInitializer } from './database-initializer';
import { IncomeManager } from './income-manager';
import { ExpenseManager } from './expense-manager';
import { BudgetManager } from './budget-manager';
import { CategoryManager } from './category-manager';

/**
 * Main database service that orchestrates all database operations
 * Acts as a facade for the different specialized managers
 */
export class DatabaseService {
  private initializer: DatabaseInitializer;
  private incomeManager: IncomeManager;
  private expenseManager: ExpenseManager;
  private budgetManager: BudgetManager;
  private categoryManager: CategoryManager;
  private initialized = false;

  constructor() {
    this.initializer = new DatabaseInitializer();
    this.incomeManager = new IncomeManager();
    this.expenseManager = new ExpenseManager();
    this.budgetManager = new BudgetManager();
    this.categoryManager = new CategoryManager();
  }

  /**
   * Initialize the database and all managers
   */
  async init(): Promise<boolean> {
    if (this.initialized) return true;
    
    try {
      console.log("Starting database initialization...");
      const success = await this.initializer.initialize();
      
      if (!success) {
        console.error("Failed to initialize database");
        this.initialized = false;
        return false;
      }
      
      // Share the database instance with all managers
      const dbInstance = this.initializer.getDb();
      if (!dbInstance) {
        console.error("Database instance is null after initialization");
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        this.initialized = false;
        return false;
      }
      
      // Initialize all managers with the shared database instance
      this.incomeManager.setDb(dbInstance).setInitialized(true);
      this.expenseManager.setDb(dbInstance).setInitialized(true);
      this.budgetManager.setDb(dbInstance).setInitialized(true);
      this.categoryManager.setDb(dbInstance).setInitialized(true);
      
      this.initialized = true;
      console.log("Database service initialized successfully");
      return true;
    } catch (err) {
      console.error('Database initialization error:', err);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Unable to initialize the database. Please refresh the page."
      });
      this.initialized = false;
      return false;
    }
  }

  // Income operations
  async getIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return this.incomeManager.getIncomes();
  }

  async addIncome(income: Income) {
    await this.ensureInitialized();
    await this.incomeManager.addIncome(income);
  }

  async updateIncome(income: Income) {
    await this.ensureInitialized();
    await this.incomeManager.updateIncome(income);
  }

  async deleteIncome(id: string) {
    await this.ensureInitialized();
    await this.incomeManager.deleteIncome(id);
  }

  // Expense operations
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return this.expenseManager.getExpenses();
  }

  async addExpense(expense: Expense) {
    await this.ensureInitialized();
    await this.expenseManager.addExpense(expense);
  }

  async deleteExpense(id: string) {
    await this.ensureInitialized();
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.expenseManager.deleteExpense(id);
  }

  // Budget operations
  async getBudgets(): Promise<Budget[]> {
    await this.ensureInitialized();
    return this.budgetManager.getBudgets();
  }

  async addBudget(budget: Budget) {
    await this.ensureInitialized();
    await this.budgetManager.addBudget(budget);
  }

  async updateBudget(budget: Budget) {
    await this.ensureInitialized();
    await this.budgetManager.updateBudget(budget);
  }

  async deleteBudget(id: string) {
    await this.ensureInitialized();
    await this.budgetManager.deleteBudget(id);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return this.categoryManager.getCategories();
  }

  async addCategory(category: Category) {
    await this.ensureInitialized();
    await this.categoryManager.addCategory(category);
  }

  async updateCategory(category: Category) {
    await this.ensureInitialized();
    await this.categoryManager.updateCategory(category);
  }

  async deleteCategory(id: string) {
    await this.ensureInitialized();
    await this.categoryManager.deleteCategory(id);
  }

  // Additional operations
  async migrateFromLocalStorage() {
    await this.ensureInitialized();
    await this.initializer.migrateFromLocalStorage();
  }

  async resetCategoryExpenses(categoryId: string) {
    const category = (await this.getCategories()).find(c => c.id === categoryId);
    if (category) {
      category.spent = 0;
      await this.updateCategory(category);
    }
  }

  exportData() {
    return this.initializer.exportData();
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      console.log("Database service not initialized, initializing now...");
      const success = await this.init();
      if (!success) {
        console.error("Failed to initialize database service");
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        throw new Error("Failed to initialize database service");
      }
    }
  }
}
