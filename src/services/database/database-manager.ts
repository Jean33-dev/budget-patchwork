
import { toast } from "@/components/ui/use-toast";
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseInitManager } from './database-init-manager';
import { DatabaseInitializationManager } from './initialization-manager';
import { DataExportManager } from './data-export-manager';
import { QueryManager } from './query-manager';

export class DatabaseManager {
  private initManager: DatabaseInitManager;
  private initializationManager: DatabaseInitializationManager;
  private dataExportManager: DataExportManager;
  private queryManager: QueryManager;

  constructor() {
    this.initManager = new DatabaseInitManager();
    this.initializationManager = new DatabaseInitializationManager();
    this.dataExportManager = new DataExportManager();
    this.queryManager = new QueryManager();
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
      this.dataExportManager.setDb(dbInstance);
      this.queryManager.setDb(dbInstance);
      
      // Mark all managers as initialized
      this.initializationManager.setInitialized(true);
      this.dataExportManager.setInitialized(true);
      this.queryManager.setInitialized(true);
      
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
    return this.queryManager.executeGetIncomes();
  }

  async addIncome(income: Income) {
    await this.ensureInitialized();
    await this.queryManager.executeAddIncome(income);
  }

  async updateIncome(income: Income) {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateIncome(income);
  }

  async deleteIncome(id: string) {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteIncome(id);
  }

  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return this.queryManager.executeGetExpenses();
  }

  async addExpense(expense: Expense) {
    await this.ensureInitialized();
    await this.queryManager.executeAddExpense(expense);
  }

  async deleteExpense(id: string) {
    await this.ensureInitialized();
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.queryManager.executeDeleteExpense(id);
  }

  async getBudgets(): Promise<Budget[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
    return this.queryManager.executeGetBudgets();
  }

  async addBudget(budget: Budget) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeAddBudget(budget);
  }

  async updateBudget(budget: Budget) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeUpdateBudget(budget);
  }

  async deleteBudget(id: string) {
    const success = await this.ensureInitialized();
    if (!success) return;
    await this.queryManager.executeDeleteBudget(id);
  }

  async getCategories(): Promise<Category[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
    return this.queryManager.executeGetCategories();
  }

  async addCategory(category: Category) {
    await this.ensureInitialized();
    await this.queryManager.executeAddCategory(category);
  }

  async updateCategory(category: Category) {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateCategory(category);
  }

  async deleteCategory(id: string) {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteCategory(id);
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
