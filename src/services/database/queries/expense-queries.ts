
import { Expense } from '../models/expense';

export const expenseQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      type TEXT,
      linkedBudgetId TEXT,
      date TEXT
    )
  `,
  
  getAll: (db: any): Expense[] => {
    try {
      const result = db.exec('SELECT * FROM expenses');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      return result[0].values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: row[2],
        spent: row[3],
        type: row[4] as 'expense',
        linkedBudgetId: row[5],
        date: row[6]
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  add: (db: any, expense: Expense): void => {
    try {
      const stmt = db.prepare(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      stmt.run([expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]);
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      throw error;
    }
  },
  
  delete: (db: any, id: string): void => {
    try {
      console.log(`Suppression de la dépense avec l'ID: ${id} dans la base de données`);
      // Implémentation réelle de la suppression
      const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
      stmt.run([id]);
      stmt.free();
      console.log(`Dépense ${id} supprimée avec succès`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'une dépense:", error);
      throw error;
    }
  }
};
