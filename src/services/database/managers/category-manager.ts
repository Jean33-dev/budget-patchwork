
import { toast } from "@/components/ui/use-toast";
import { Category } from '../models/category';
import { BaseDatabaseManager } from '../base-database-manager';

/**
 * Responsible for handling category-related database operations
 */
export class CategoryManager extends BaseDatabaseManager {
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
  async addCategory(category: Category) {
    await this.ensureInitialized();
    await this.queryManager.executeAddCategory(category);
  }

  /**
   * Update an existing category in the database
   */
  async updateCategory(category: Category) {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateCategory(category);
  }

  /**
   * Delete a category from the database
   */
  async deleteCategory(id: string) {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteCategory(id);
  }

  /**
   * Reset the spent amount for a category
   */
  async resetCategoryExpenses(categoryId: string) {
    const category = (await this.getCategories()).find(c => c.id === categoryId);
    if (category) {
      category.spent = 0;
      await this.updateCategory(category);
    }
  }
}
