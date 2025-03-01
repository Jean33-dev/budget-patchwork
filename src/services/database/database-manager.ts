
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

  constructor() {
    this.initManager = new DatabaseInitManager();
    this.incomeManager = new IncomeManager();
    this.expenseManager = new ExpenseManager();
    this.budgetManager = new BudgetManager();
    this.categoryManager = new CategoryManager();
  }

  async init() {
    if (this.initialized) return;
    
    try {
      // Initialize the database
      await this.initManager.init();
      
      // Share the database instance with all managers
      this.incomeManager.db = this.initManager.db;
      this.expenseManager.db = this.initManager.db;
      this.budgetManager.db = this.initManager.db;
      this.categoryManager.db = this.initManager.db;
      
      // Mark all managers as initialized
      this.incomeManager.initialized = true;
      this.expenseManager.initialized = true;
      this.budgetManager.initialized = true;
      this.categoryManager.initialized = true;
      
      this.initialized = true;
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      throw err;
    }
  }

  // Delegate methods to their respective managers
  
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
    await this.expenseManager.deleteExpense(id);
  }

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

  // Migration method
  async migrateFromLocalStorage() {
    await this.ensureInitialized();
    await this.initManager.migrateFromLocalStorage();
  }

  // Utility methods
  exportData() {
    return this.initManager.exportData();
  }

  private async ensureInitialized() {
    if (!this.initialized) await this.init();
  }
}
