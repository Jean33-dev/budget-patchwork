
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
    const result = db.exec('SELECT * FROM expenses');
    return result[0]?.values?.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      budget: row[2],
      spent: row[3],
      type: row[4] as 'expense',
      linkedBudgetId: row[5],
      date: row[6]
    })) || [];
  },
  
  add: (db: any, expense: Expense): void => {
    db.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
    );
  },
  
  update: (db: any, expense: Expense): void => {
    db.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.id]
    );
  },
  
  delete: (db: any, id: string): boolean => {
    try {
      console.log(`Tentative de suppression de la dépense avec l'ID: ${id}`);
      
      if (!id) {
        console.error("ID de dépense invalide pour la suppression");
        return false;
      }
      
      // Exécution directe de la suppression sans vérifications supplémentaires
      db.run('DELETE FROM expenses WHERE id = ?', [id]);
      console.log(`Dépense avec l'ID ${id} supprimée avec succès`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la dépense avec l'ID ${id}:`, error);
      return false;
    }
  }
};
