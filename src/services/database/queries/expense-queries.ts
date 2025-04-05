
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
      dashboardId TEXT
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
      
      const expenses = result[0].values.map((row: any[]) => {
        // Utilisation de conversions explicites pour s'assurer que les valeurs sont du bon type
        return {
          id: String(row[0]),
          title: String(row[1] || ''),
          budget: Number(row[2] || 0),
          spent: Number(row[3] || 0),
          type: 'expense' as const,
          linkedBudgetId: row[5] ? String(row[5]) : null,
          date: String(row[6] || new Date().toISOString().split('T')[0]),
          dashboardId: row[7] ? String(row[7]) : 'budget' // Utiliser 'budget' comme valeur par défaut
        };
      });
      
      return expenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  add: (db: any, expense: Expense): void => {
    if (!db) {
      console.error("Database is null in expenseQueries.add");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        String(expense.id), 
        String(expense.title || 'Sans titre'), 
        Number(expense.budget || 0), 
        Number(expense.spent || 0), 
        'expense', 
        expense.linkedBudgetId ? String(expense.linkedBudgetId) : null, 
        String(expense.date || new Date().toISOString().split('T')[0]),
        String(expense.dashboardId || 'budget') // Ajouter le dashboardId dans la requête
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
    }
  },
  
  update: (db: any, expense: Expense): void => {
    if (!db) {
      console.error("Database is null in expenseQueries.update");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, dashboardId = ? WHERE id = ?'
      );
      
      stmt.run([
        String(expense.title || 'Sans titre'),
        Number(expense.budget || 0),
        Number(expense.spent || expense.budget || 0),
        expense.linkedBudgetId ? String(expense.linkedBudgetId) : null, 
        String(expense.date || new Date().toISOString().split('T')[0]),
        String(expense.dashboardId || 'budget'), // Ajouter le dashboardId dans la mise à jour
        String(expense.id)
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une dépense:", error);
    }
  },
  
  delete: (db: any, id: string): void => {
    if (!db) {
      console.error("Database is null in expenseQueries.delete");
      return;
    }
    
    try {
      const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
      console.log("Executing DELETE query with ID:", id);
      stmt.run([String(id)]);
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la suppression d'une dépense:", error);
    }
  }
};
