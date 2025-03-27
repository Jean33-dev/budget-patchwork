
import { toast } from "@/components/ui/use-toast";
import { Category } from '../models/category';
import { BaseDatabaseManager } from '../base-database-manager';
import { ICategoryManager } from '../interfaces/ICategoryManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling category-related database operations
 */
export class CategoryManager extends BaseDatabaseManager implements ICategoryManager {
  /**
   * Get all categories from the database
   */
  async getCategories(): Promise<Category[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
    return this.queryManager.executeGetCategories();
  }

  /**
   * Add a new category to the database
   */
  async addCategory(category: Category): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeAddCategory(category);
  }

  /**
   * Update an existing category in the database
   */
  async updateCategory(category: Category): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateCategory(category);
  }

  /**
   * Delete a category from the database
   */
  async deleteCategory(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteCategory(id);
  }

  /**
   * Reset the spent amount for a category
   */
  async resetCategoryExpenses(categoryId: string): Promise<void> {
    const category = (await this.getCategories()).find(c => c.id === categoryId);
    if (category) {
      category.spent = 0;
      await this.updateCategory(category);
    }
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): void {
    this.queryManager = queryManager;
  }
}
