
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

  constructor() {
    super();
    this.initManager = new DatabaseInitManager();
    this.budgetManager = new BudgetManager();
    this.expenseManager = new ExpenseManager();
    this.incomeManager = new IncomeManager();
    this.categoryManager = new CategoryManager();
  }

  async init(): Promise<boolean> {
    // First initialize the core
    const coreSuccess = await super.init();
    if (!coreSuccess) return false;
    
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
  }
  
  // Méthode pour réinitialiser le compteur de tentatives
  resetInitializationAttempts(): void {
    BaseDatabaseManager.resetInitializationAttempts();
  }

  // Delegate methods to the appropriate managers
  
  // Budget methods
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

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return this.expenseManager.getExpenses();
  }

  async addExpense(expense: Expense) {
    await this.ensureInitialized();
    await this.expenseManager.addExpense(expense);
  }

  async updateExpense(expense: Expense) {
    await this.ensureInitialized();
    await this.expenseManager.updateExpense(expense);
  }

  async deleteExpense(id: string) {
    await this.ensureInitialized();
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.expenseManager.deleteExpense(id);
  }

  // Income methods
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

  // Category methods
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

  async resetCategoryExpenses(categoryId: string) {
    await this.ensureInitialized();
    await this.categoryManager.resetCategoryExpenses(categoryId);
  }

  async migrateFromLocalStorage() {
    await this.ensureInitialized();
    await this.initManager.migrateFromLocalStorage();
  }
}
