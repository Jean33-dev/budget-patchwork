
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
      date TEXT,
      visible INTEGER DEFAULT 1
    )
  `,
  
  getAll: (db: any): Expense[] => {
    try {
      // Requête pour récupérer uniquement les dépenses visibles
      const stmt = db.prepare('SELECT * FROM expenses WHERE visible = 1 OR visible IS NULL');
      const result = stmt.getAsObject();
      stmt.free();
      
      if (!result || !result.values) {
        return [];
      }
      
      return result.values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: row[2],
        spent: row[3],
        type: row[4] as 'expense',
        linkedBudgetId: row[5],
        date: row[6],
        visible: row[7] === 1 || row[7] === null
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  add: (db: any, expense: Expense): void => {
    try {
      const stmt = db.prepare(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      stmt.run([
        expense.id, 
        expense.title, 
        expense.budget, 
        expense.spent, 
        expense.type, 
        expense.linkedBudgetId, 
        expense.date, 
        expense.visible !== false ? 1 : 0
      ]);
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      throw error;
    }
  },
  
  update: (db: any, expense: Expense): void => {
    try {
      const stmt = db.prepare(
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, visible = ? WHERE id = ?'
      );
      stmt.run([
        expense.title, 
        expense.budget, 
        expense.spent, 
        expense.linkedBudgetId, 
        expense.date, 
        expense.visible !== false ? 1 : 0, 
        expense.id
      ]);
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une dépense:", error);
      throw error;
    }
  },
  
  hideExpense: (db: any, id: string): boolean => {
    try {
      if (!id) return false;
      
      const stmt = db.prepare('UPDATE expenses SET visible = 0 WHERE id = ?');
      stmt.run([id]);
      stmt.free();
      
      return true;
    } catch (error) {
      console.error(`Erreur lors du masquage de la dépense:`, error);
      return false;
    }
  },
  
  delete: (db: any, id: string): boolean => {
    try {
      if (!id) return false;
      
      const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
      stmt.run([id]);
      stmt.free();
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression:`, error);
      return false;
    }
  }
};
