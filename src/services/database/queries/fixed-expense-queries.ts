
import { FixedExpense } from '../models/fixedExpense';

export const fixedExpenseQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS fixed_expenses (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      type TEXT,
      linkedBudgetId TEXT,
      date TEXT
    )
  `,
  
  getAll: (db: any): FixedExpense[] => {
    try {
      if (!db) {
        console.error("Database is null in fixedExpenseQueries.getAll");
        return [];
      }
      
      const result = db.exec('SELECT * FROM fixed_expenses');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      const fixedExpenses = result[0].values.map((row: any[]) => {
        return {
          id: String(row[0]),
          title: String(row[1] || ''),
          budget: Number(row[2] || 0),
          type: 'expense' as const,
          linkedBudgetId: row[4] ? String(row[4]) : null,
          date: String(row[5] || new Date().toISOString().split('T')[0])
        };
      });
      
      return fixedExpenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses fixes:", error);
      return [];
    }
  },
  
  add: (db: any, fixedExpense: FixedExpense): void => {
    if (!db) {
      console.error("Database is null in fixedExpenseQueries.add");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'INSERT INTO fixed_expenses (id, title, budget, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        String(fixedExpense.id), 
        String(fixedExpense.title || 'Sans titre'), 
        Number(fixedExpense.budget || 0), 
        'expense', 
        fixedExpense.linkedBudgetId ? String(fixedExpense.linkedBudgetId) : null, 
        String(fixedExpense.date || new Date().toISOString().split('T')[0])
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense fixe:", error);
    }
  },
  
  update: (db: any, fixedExpense: FixedExpense): void => {
    if (!db) {
      console.error("Database is null in fixedExpenseQueries.update");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'UPDATE fixed_expenses SET title = ?, budget = ?, linkedBudgetId = ?, date = ? WHERE id = ?'
      );
      
      stmt.run([
        String(fixedExpense.title || 'Sans titre'),
        Number(fixedExpense.budget || 0),
        fixedExpense.linkedBudgetId ? String(fixedExpense.linkedBudgetId) : null, 
        String(fixedExpense.date || new Date().toISOString().split('T')[0]),
        String(fixedExpense.id)
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une dépense fixe:", error);
    }
  },
  
  delete: (db: any, id: string): void => {
    if (!db) {
      console.error("Database is null in fixedExpenseQueries.delete");
      return;
    }
    
    try {
      const stmt = db.prepare('DELETE FROM fixed_expenses WHERE id = ?');
      stmt.run([String(id)]);
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la suppression d'une dépense fixe:", error);
    }
  },
  
  updateDates: (db: any, newDate: string): void => {
    if (!db) {
      console.error("Database is null in fixedExpenseQueries.updateDates");
      return;
    }
    
    try {
      const stmt = db.prepare('UPDATE fixed_expenses SET date = ?');
      stmt.run([newDate]);
      stmt.free();
      console.log("Dates des dépenses fixes mises à jour vers:", newDate);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des dates des dépenses fixes:", error);
    }
  }
};
