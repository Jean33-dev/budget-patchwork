
import { Category } from '../models/category';
import { BaseService } from './base-service';

/**
 * Service for handling category-related database operations
 */
export class CategoryService extends BaseService {
  /**
   * Retrieves all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM categories");
      
      return results.map(row => {
        let budgets;
        try {
          budgets = row.budgets && typeof row.budgets === 'string' 
            ? JSON.parse(row.budgets) 
            : [];
        } catch (e) {
          console.error(`Erreur de parsing des budgets pour la catégorie ${row.id}:`, e);
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
      console.error("Erreur lors de la récupération des catégories:", error);
      return [];
    }
  }

  /**
   * Adds a new category
   */
  async addCategory(category: Category): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await adapter!.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, budgetsJson, category.total, category.spent, category.description]
    );
  }

  /**
   * Updates an existing category
   */
  async updateCategory(category: Category): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await adapter!.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [category.name, budgetsJson, category.total, category.spent, category.description, category.id]
    );
  }

  /**
   * Deletes a category
   */
  async deleteCategory(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM categories WHERE id = ?', [id]);
  }
}
