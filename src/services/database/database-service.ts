
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseInitService } from './database-init-service';
import { DatabaseCrudService } from './database-crud-service';

/**
 * Main database service with progressive transition to SQLite
 * This class uses the SQLite adapter to abstract database access
 */
class DatabaseService {
  private initService: DatabaseInitService;
  private crudService: DatabaseCrudService;

  constructor() {
    this.initService = new DatabaseInitService();
    this.crudService = new DatabaseCrudService(this.initService);
  }

  /**
   * Initializes the database with the appropriate adapter
   */
  async init(): Promise<boolean> {
    return this.initService.init();
  }

  /**
   * Resets the initialization attempts counter
   */
  resetInitializationAttempts(): void {
    this.initService.resetInitializationAttempts();
  }

  // Income operations
  async getIncomes(): Promise<Income[]> {
    return this.crudService.getIncomes();
  }

  async addIncome(income: Income): Promise<void> {
    return this.crudService.addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    return this.crudService.updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    return this.crudService.deleteIncome(id);
  }

  // Expense operations
  async getExpenses(): Promise<Expense[]> {
    return this.crudService.getExpenses();
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.crudService.addExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    console.log(`Request to delete expense with ID: ${id}`);
    return this.crudService.deleteExpense(id);
  }

  // Budget operations
  async getBudgets(): Promise<Budget[]> {
    return this.crudService.getBudgets();
  }

  async addBudget(budget: Budget): Promise<void> {
    return this.crudService.addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    return this.crudService.updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    return this.crudService.deleteBudget(id);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return this.crudService.getCategories();
  }

  async addCategory(category: Category): Promise<void> {
    return this.crudService.addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    return this.crudService.updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.crudService.deleteCategory(id);
  }

  // Data export/import
  exportData(): Uint8Array | null {
    return this.crudService.exportData();
  }

  importData(data: Uint8Array): boolean {
    return this.crudService.importData(data);
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService();
