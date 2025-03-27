
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseInitService } from './database-init-service';
import { toast } from "@/components/ui/use-toast";

/**
 * Handles CRUD operations for all entity types
 */
export class DatabaseCrudService {
  private initService: DatabaseInitService;

  constructor(initService: DatabaseInitService) {
    this.initService = initService;
  }

  /**
   * Ensures the database is initialized before operations
   */
  private async ensureInitialized(): Promise<boolean> {
    if (!this.initService.isInitialized()) {
      return await this.initService.init();
    }
    return true;
  }

  // Income operations
  
  /**
   * Gets all incomes from the database
   */
  async getIncomes(): Promise<Income[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initService.getAdapter();
      if (!adapter) return [];
      
      const results = await adapter.query("SELECT * FROM incomes");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'income' as const,
        date: row.date
      }));
    } catch (error) {
      console.error("Error getting incomes:", error);
      return [];
    }
  }

  /**
   * Adds a new income to the database
   */
  async addIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run(
      'INSERT INTO incomes (id, title, budget, spent, type, date) VALUES (?, ?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type, income.date]
    );
  }

  /**
   * Updates an existing income
   */
  async updateIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.id]
    );
  }

  /**
   * Deletes an income
   */
  async deleteIncome(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run('DELETE FROM incomes WHERE id = ?', [id]);
  }

  // Expense operations
  
  /**
   * Gets all expenses from the database
   */
  async getExpenses(): Promise<Expense[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initService.getAdapter();
      if (!adapter) return [];
      
      const results = await adapter.query("SELECT * FROM expenses");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'expense' as const,
        linkedBudgetId: row.linkedBudgetId,
        date: row.date
      }));
    } catch (error) {
      console.error("Error getting expenses:", error);
      return [];
    }
  }

  /**
   * Adds a new expense to the database
   */
  async addExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
    );
  }

  /**
   * Deletes an expense
   */
  async deleteExpense(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  // Budget operations
  
  /**
   * Gets all budgets from the database
   */
  async getBudgets(): Promise<Budget[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initService.getAdapter();
      if (!adapter) return [];
      
      const results = await adapter.query("SELECT * FROM budgets");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'budget' as const,
        carriedOver: Number(row.carriedOver || 0)
      }));
    } catch (error) {
      console.error("Error getting budgets:", error);
      return [];
    }
  }

  /**
   * Adds a new budget to the database
   */
  async addBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run(
      'INSERT INTO budgets (id, title, budget, spent, type, carriedOver) VALUES (?, ?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0]
    );
  }

  /**
   * Updates an existing budget
   */
  async updateBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, budget.id]
    );
  }

  /**
   * Deletes a budget
   */
  async deleteBudget(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run('DELETE FROM budgets WHERE id = ?', [id]);
  }

  // Category operations
  
  /**
   * Gets all categories from the database
   */
  async getCategories(): Promise<Category[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initService.getAdapter();
      if (!adapter) return [];
      
      const results = await adapter.query("SELECT * FROM categories");
      
      return results.map(row => {
        let budgets;
        try {
          budgets = row.budgets && typeof row.budgets === 'string' 
            ? JSON.parse(row.budgets) 
            : [];
        } catch (e) {
          console.error(`Error parsing budgets for category ${row.id}:`, e);
          budgets = [];
        }
        
        return {
          id: row.id,
          name: row.name,
          budgets: Array.isArray(budgets) ? budgets : [],
          total: Number(row.total) || 0,
          spent: Number(row.spent) || 0,
          description: row.description || ''
        };
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  }

  /**
   * Adds a new category to the database
   */
  async addCategory(category: Category): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await adapter.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, budgetsJson, category.total, category.spent, category.description]
    );
  }

  /**
   * Updates an existing category
   */
  async updateCategory(category: Category): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await adapter.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [category.name, budgetsJson, category.total, category.spent, category.description, category.id]
    );
  }

  /**
   * Deletes a category
   */
  async deleteCategory(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initService.getAdapter();
    if (!adapter) return;
    
    await adapter.run('DELETE FROM categories WHERE id = ?', [id]);
  }

  /**
   * Exports database data as Uint8Array
   */
  exportData(): Uint8Array | null {
    const adapter = this.initService.getAdapter();
    if (adapter && 'exportData' in adapter) {
      return (adapter as any).exportData();
    }
    return null;
  }

  /**
   * Imports data into the database
   */
  importData(data: Uint8Array): boolean {
    const adapter = this.initService.getAdapter();
    if (adapter && 'importData' in adapter) {
      return (adapter as any).importData(data);
    }
    return false;
  }
}
