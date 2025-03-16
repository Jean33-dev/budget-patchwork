import { toast } from "@/components/ui/use-toast";
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseInitManager } from './database-init-manager';
import { IncomeManager } from './income-manager';
import { ExpenseManager } from './expense-manager';
import { BudgetManager } from './budget-manager';
import { CategoryManager } from './category-manager';

export class DatabaseManager {
  private initManager: DatabaseInitManager;
  private incomeManager: IncomeManager;
  private expenseManager: ExpenseManager;
  private budgetManager: BudgetManager;
  private categoryManager: CategoryManager;
  private initialized = false;
  private initializationInProgress = false;
  private initializationPromise: Promise<boolean> | null = null;

  constructor() {
    this.initManager = new DatabaseInitManager();
    this.incomeManager = new IncomeManager();
    this.expenseManager = new ExpenseManager();
    this.budgetManager = new BudgetManager();
    this.categoryManager = new CategoryManager();
  }

  async init(): Promise<boolean> {
    // If already initialized, return true
    if (this.initialized) return true;
    
    // If initialization is in progress, return the existing promise
    if (this.initializationInProgress && this.initializationPromise) {
      return this.initializationPromise;
    }
    
    // Set flag and create promise
    this.initializationInProgress = true;
    
    this.initializationPromise = (async () => {
      try {
        console.log("Starting database initialization...");
        // Initialize the database
        const success = await this.initManager.init();
        
        if (!success) {
          console.error("Failed to initialize database");
          toast({
            variant: "destructive",
            title: "Database Error",
            description: "Unable to initialize the database. Please refresh the page."
          });
          this.initialized = false;
          return false;
        }
        
        // Share the database instance with all managers using the accessor methods
        const dbInstance = this.initManager.getDb();
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
        
        this.incomeManager.setDb(dbInstance);
        this.expenseManager.setDb(dbInstance);
        this.budgetManager.setDb(dbInstance);
        this.categoryManager.setDb(dbInstance);
        
        // Mark all managers as initialized
        this.incomeManager.setInitialized(true);
        this.expenseManager.setInitialized(true);
        this.budgetManager.setInitialized(true);
        this.categoryManager.setInitialized(true);
        
        this.initialized = true;
        console.log("Database manager initialized successfully");
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
      } finally {
        this.initializationInProgress = false;
      }
    })();
    
    return this.initializationPromise;
  }

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

  async migrateFromLocalStorage() {
    await this.ensureInitialized();
    await this.initManager.migrateFromLocalStorage();
  }

  async resetCategoryExpenses(categoryId: string) {
    const category = (await this.getCategories()).find(c => c.id === categoryId);
    if (category) {
      category.spent = 0;
      await this.updateCategory(category);
    }
  }

  exportData() {
    return this.initManager.exportData();
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      console.log("Database manager not initialized, initializing now...");
      const success = await this.init();
      if (!success) {
        console.error("Failed to initialize database manager");
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        throw new Error("Failed to initialize database manager");
      }
    }
  }
}
