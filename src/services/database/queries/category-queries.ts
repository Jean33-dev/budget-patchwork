
import { Category } from '../models/category';
import { toast } from "@/components/ui/use-toast";

export const categoryQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT,
      budgets TEXT,
      total REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      description TEXT
    )
  `,
  
  getAll: (db: any): Category[] => {
    try {
      console.log("=== Début du chargement des catégories ===");
      const result = db.exec('SELECT * FROM categories');
      console.log("Résultat brut de la requête:", result);
      
      if (!result[0]?.values) {
        console.log("Aucune catégorie trouvée");
        return [];
      }

      const categories = result[0].values.map((row: any[]) => {
        const [id, name, budgetsStr, total, spent, description] = row;
        let budgets;
        try {
          // S'assurer que le string JSON est valide avant de le parser
          budgets = budgetsStr && typeof budgetsStr === 'string' ? JSON.parse(budgetsStr) : [];
          console.log(`Budgets parsés pour la catégorie ${id}:`, budgets);
        } catch (e) {
          console.error(`Erreur de parsing des budgets pour la catégorie ${id}:`, e);
          budgets = [];
        }

        return {
          id,
          name,
          budgets: Array.isArray(budgets) ? budgets : [],
          total: Number(total) || 0,
          spent: Number(spent) || 0,
          description: description || ''
        };
      });

      console.log("Catégories chargées avec succès:", categories);
      return categories;
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      throw error;
    }
  },
  
  add: (db: any, category: Category): void => {
    db.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description]
    );
  },
  
  update: (db: any, category: Category): void => {
    try {
      console.log("=== Début de la mise à jour de la catégorie dans la base de données ===");
      console.log("Catégorie reçue:", category);
      
      // Validation des données
      if (!category || !category.id) {
        throw new Error("Catégorie invalide");
      }
      
      // S'assurer que les budgets sont un tableau
      const budgets = Array.isArray(category.budgets) ? category.budgets : [];
      const total = Number(category.total) || 0;
      const spent = Number(category.spent) || 0;
      
      // Convertir le tableau en JSON pour le stockage
      const budgetsJson = JSON.stringify(budgets);
      console.log("Budgets avant stringify:", budgets);
      console.log("Budgets après stringify:", budgetsJson);
      
      // Utiliser une transaction pour s'assurer que tout est mis à jour correctement
      db.run('BEGIN TRANSACTION');
      
      const stmt = db.prepare(
        'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?'
      );
      
      stmt.run(
        [category.name, budgetsJson, total, spent, category.description, category.id]
      );
      stmt.free();
      
      db.run('COMMIT');
      
      // Vérifier immédiatement la mise à jour
      const result = db.exec(
        'SELECT * FROM categories WHERE id = ?',
        [category.id]
      );
      console.log("Vérification après mise à jour:", result);
      
      console.log("=== Mise à jour terminée avec succès ===");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      db.run('ROLLBACK');
      throw error;
    }
  },
  
  delete: (db: any, id: string): void => {
    db.run('DELETE FROM categories WHERE id = ?', [id]);
  }
};
