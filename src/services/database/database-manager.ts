
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
import { DatabaseInitializationManager } from './initialization-manager';
import { DataExportManager } from './data-export-manager';

export class DatabaseManager {
  private initManager: DatabaseInitManager;
  private initializationManager: DatabaseInitializationManager;
  private incomeManager: IncomeManager;
  private expenseManager: ExpenseManager;
  private budgetManager: BudgetManager;
  private categoryManager: CategoryManager;
  private dataExportManager: DataExportManager;

  constructor() {
    this.initManager = new DatabaseInitManager();
    this.initializationManager = new DatabaseInitializationManager();
    this.incomeManager = new IncomeManager();
    this.expenseManager = new ExpenseManager();
    this.budgetManager = new BudgetManager();
    this.categoryManager = new CategoryManager();
    this.dataExportManager = new DataExportManager();
  }

  async init(): Promise<boolean> {
    try {
      // First initialize the base database
      const success = await this.initManager.init();
      
      if (!success) {
        return false;
      }
      
      // Share the database instance with all managers
      const dbInstance = this.initManager.getDb();
      if (!dbInstance) {
        console.error("Database instance is null after initialization");
        return false;
      }
      
      this.initializationManager.setDb(dbInstance);
      this.incomeManager.setDb(dbInstance);
      this.expenseManager.setDb(dbInstance);
      this.budgetManager.setDb(dbInstance);
      this.categoryManager.setDb(dbInstance);
      this.dataExportManager.setDb(dbInstance);
      
      // Mark all managers as initialized
      this.initializationManager.setInitialized(true);
      this.incomeManager.setInitialized(true);
      this.expenseManager.setInitialized(true);
      this.budgetManager.setInitialized(true);
      this.categoryManager.setInitialized(true);
      this.dataExportManager.setInitialized(true);
      
      return true;
    } catch (err) {
      console.error('Error initializing database manager:', err);
      toast({
        variant: "destructive",
        title: "Database error",
        description: "Unable to initialize the database. Please refresh the page."
      });
      return false;
    }
  }

  isInitialized(): boolean {
    return this.initManager.isInitialized();
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
    const success = await this.ensureInitialized();
    if (!success) return [];
    return this.budgetManager.getBudgets();
  }

  async addBudget(budget: Budget) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.budgetManager.addBudget(budget);
  }

  async updateBudget(budget: Budget) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.budgetManager.updateBudget(budget);
  }

  async deleteBudget(id: string) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.budgetManager.deleteBudget(id);
  }

  async getCategories(): Promise<Category[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
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
    return this.dataExportManager.exportData();
  }

  private async ensureInitialized(): Promise<boolean> {
    if (!this.initializationManager.isInitialized()) {
      console.log("Database manager not initialized, initializing now...");
      const success = await this.init();
      if (!success) {
        console.error("Failed to initialize database manager");
        toast({
          variant: "destructive",
          title: "Database error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        return false;
      }
    }
    return true;
  }
}
