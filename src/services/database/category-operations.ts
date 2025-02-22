
import { Category } from '@/types/database-types';

export class CategoryOperations {
  constructor(private db: any) {}

  async getCategories(): Promise<Category[]> {
    const result = this.db.exec('SELECT * FROM categories');
    return result[0]?.values?.map((row: any[]) => {
      let budgets;
      try {
        budgets = JSON.parse(row[2]);
      } catch {
        budgets = [];
      }
      
      return {
        id: String(row[0]),
        name: String(row[1]),
        budgets,
        total: Number(row[3]),
        spent: Number(row[4]),
        description: row[5] ? String(row[5]) : ''
      };
    }) || [];
  }

  async addCategory(category: Category) {
    this.db.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [
        String(category.id),
        String(category.name),
        JSON.stringify(category.budgets),
        Number(category.total),
        Number(category.spent),
        category.description
      ]
    );
  }

  async updateCategory(category: Category) {
    this.db.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [
        String(category.name),
        JSON.stringify(category.budgets),
        Number(category.total),
        Number(category.spent),
        category.description,
        String(category.id)
      ]
    );
  }

  async deleteCategory(id: string) {
    this.db.run('DELETE FROM categories WHERE id = ?', [String(id)]);
  }
}
