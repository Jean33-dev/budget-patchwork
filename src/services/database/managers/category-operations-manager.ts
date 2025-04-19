
import { toast } from "@/components/ui/use-toast";
import { Category } from '../models/category';
import { DatabaseManagerFactory } from '../database-manager-factory';

export class CategoryOperationsManager {
  private ensureInitialized: () => Promise<boolean>;
  private managerFactory: DatabaseManagerFactory;

  constructor(
    ensureInitialized: () => Promise<boolean>,
    managerFactory: DatabaseManagerFactory
  ) {
    this.ensureInitialized = ensureInitialized;
    this.managerFactory = managerFactory;
  }

  async getCategories(): Promise<Category[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getCategories");
        return [];
      }
      return this.managerFactory.getCategoryManager().getCategories();
    } catch (error) {
      console.error("Error in getCategories:", error);
      return [];
    }
  }

  async addCategory(category: Category): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addCategory");
    }
    await this.managerFactory.getCategoryManager().addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateCategory");
    }
    await this.managerFactory.getCategoryManager().updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteCategory");
    }
    await this.managerFactory.getCategoryManager().deleteCategory(id);
  }

  async resetCategoryExpenses(categoryId: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in resetCategoryExpenses");
    }
    await this.managerFactory.getCategoryManager().resetCategoryExpenses(categoryId);
  }
}
