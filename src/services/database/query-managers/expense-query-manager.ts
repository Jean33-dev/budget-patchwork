
import { QueryManager } from '../query-manager';
import { Expense } from '../models/expense';
import { expenseQueries } from '../queries/expense';
import { BaseQueryManager } from './base-query-manager';

export class ExpenseQueryManager extends BaseQueryManager {
  private queryCache: Map<string, { data: any, timestamp: number }> = new Map();
  private CACHE_EXPIRY = 5000; // 5 second cache
  
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Expense[]> {
    try {
      // Check if we have cached results
      const cachedResult = this.queryCache.get('getAll');
      if (cachedResult && (Date.now() - cachedResult.timestamp < this.CACHE_EXPIRY)) {
        return cachedResult.data;
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        return [];
      }
      
      const db = this.getDb();
      if (!db) {
        return [];
      }
      
      const result = expenseQueries.getAll(db);
      
      // Cache the result
      this.queryCache.set('getAll', {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error("Error getting expenses:", error);
      return [];
    }
  }

  async getRecurring(): Promise<Expense[]> {
    try {
      // Check if we have cached results
      const cachedResult = this.queryCache.get('getRecurring');
      if (cachedResult && (Date.now() - cachedResult.timestamp < this.CACHE_EXPIRY)) {
        return cachedResult.data;
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        return [];
      }
      
      const db = this.getDb();
      if (!db) {
        return [];
      }
      
      // First try to get recurring expenses using the isRecurring column
      try {
        const result = expenseQueries.getRecurring(db);
        
        // Cache the result
        this.queryCache.set('getRecurring', {
          data: result,
          timestamp: Date.now()
        });
        
        return result;
      } catch (error) {
        // If the column doesn't exist, try to create it
        try {
          db.exec("ALTER TABLE expenses ADD COLUMN isRecurring INTEGER DEFAULT 0");
          return [];
        } catch (alterError) {
          console.error("Error adding isRecurring column:", alterError);
          return [];
        }
      }
    } catch (error) {
      console.error("Error getting recurring expenses:", error);
      return [];
    }
  }

  async add(expense: Expense): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) {
        return;
      }
      
      const db = this.getDb();
      if (!db) {
        return;
      }
      
      expenseQueries.add(db, expense);
      
      // Invalidate cache after mutation
      this.invalidateCache();
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  }

  async update(expense: Expense): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) {
        return;
      }
      
      const db = this.getDb();
      if (!db) {
        return;
      }
      
      expenseQueries.update(db, expense);
      
      // Invalidate cache after mutation
      this.invalidateCache();
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        return;
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        return;
      }
      
      const db = this.getDb();
      if (!db) {
        return;
      }
      
      expenseQueries.delete(db, id);
      
      // Invalidate cache after mutation
      this.invalidateCache();
    } catch (error) {
      console.error(`Error deleting expense with ID ${id}:`, error);
      throw error;
    }
  }

  // Helper to invalidate the cache after mutations
  private invalidateCache(): void {
    this.queryCache.clear();
  }
}
