
import { BaseDatabaseManager } from './base-database-manager';
import { Category } from './models/category';
import { categoryQueries } from './queries/category-queries';

export class CategoryManager extends BaseDatabaseManager {
  async getCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return categoryQueries.getAll(this.db);
  }

  async addCategory(category: Category) {
    await this.ensureInitialized();
    categoryQueries.add(this.db, category);
  }

  async updateCategory(category: Category) {
    await this.ensureInitialized();
    
    try {
      categoryQueries.update(this.db, category);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      
      // If the category doesn't exist, create it
      const result = this.db.exec(
        'SELECT * FROM categories WHERE id = ?',
        [category.id]
      );
      
      if (!result[0]) {
        console.error("La catégorie n'existe pas, tentative de création");
        await this.addCategory(category);
      } else {
        throw error;
      }
    }
  }

  async deleteCategory(id: string) {
    await this.ensureInitialized();
    categoryQueries.delete(this.db, id);
  }
}
