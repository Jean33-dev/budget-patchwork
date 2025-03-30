
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
      if (!db) {
        console.error("Database is null in expenseQueries.getAll");
        return [];
      }
      
      const result = db.exec('SELECT * FROM expenses');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      const expenses = result[0].values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: row[2],
        spent: row[3],
        type: 'expense' as const,
        linkedBudgetId: row[5],
        date: row[6] || new Date().toISOString().split('T')[0]
      }));
      
      return expenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  add: (db: any, expense: Expense): void => {
    if (!db) return;
    
    const stmt = db.prepare(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    
    stmt.run([
      expense.id, 
      expense.title || 'Sans titre', 
      expense.budget || 0, 
      expense.spent || 0, 
      'expense', 
      expense.linkedBudgetId || null, 
      expense.date || new Date().toISOString().split('T')[0]
    ]);
    
    stmt.free();
  },
  
  update: (db: any, expense: Expense): void => {
    if (!db) return;
    
    const stmt = db.prepare(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?'
    );
    
    stmt.run([
      expense.title || 'Sans titre',
      expense.budget || 0,
      expense.spent || expense.budget || 0,
      expense.linkedBudgetId || null, 
      expense.date || new Date().toISOString().split('T')[0],
      expense.id
    ]);
    
    stmt.free();
  },
  
  delete: (db: any, id: string): void => {
    if (!db) return;
    
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    stmt.run([id]);
    stmt.free();
  }
};
