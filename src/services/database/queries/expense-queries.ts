
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
      isRecurring INTEGER DEFAULT 0,
      dashboardId TEXT
    )
  `,
  
  getAll: (db: any): Expense[] => {
    try {
      if (!db) {
        console.error("Database is null in expenseQueries.getAll");
        return [];
      }
      
      // Check if isRecurring column exists
      let hasIsRecurringColumn = false;
      let hasDashboardIdColumn = false;
      try {
        // Try to query for the column in the table info
        const tableInfo = db.exec("PRAGMA table_info(expenses)");
        if (tableInfo && tableInfo.length > 0 && tableInfo[0].values) {
          hasIsRecurringColumn = tableInfo[0].values.some((col: any) => col[1] === 'isRecurring');
          hasDashboardIdColumn = tableInfo[0].values.some((col: any) => col[1] === 'dashboardId');
        }
        
        if (!hasIsRecurringColumn) {
          console.log("Adding isRecurring column to expenses table");
          db.exec("ALTER TABLE expenses ADD COLUMN isRecurring INTEGER DEFAULT 0");
        }
        
        if (!hasDashboardIdColumn) {
          console.log("Adding dashboardId column to expenses table");
          db.exec("ALTER TABLE expenses ADD COLUMN dashboardId TEXT");
        }
      } catch (e) {
        console.error("Error checking or adding columns to expenses table:", e);
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
          isRecurring: hasIsRecurringColumn ? Boolean(row[7]) : false,
          dashboardId: hasDashboardIdColumn ? (row[8] ? String(row[8]) : null) : null
        };
      });
      
      return expenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  getRecurring: (db: any): Expense[] => {
    try {
      if (!db) {
        console.error("Database is null in expenseQueries.getRecurring");
        return [];
      }
      
      // Check if isRecurring column exists
      let hasIsRecurringColumn = false;
      try {
        // Try to query for the column in the table info
        const tableInfo = db.exec("PRAGMA table_info(expenses)");
        if (tableInfo && tableInfo.length > 0 && tableInfo[0].values) {
          hasIsRecurringColumn = tableInfo[0].values.some((col: any) => col[1] === 'isRecurring');
        }
        
        if (!hasIsRecurringColumn) {
          console.log("Adding isRecurring column to expenses table");
          db.exec("ALTER TABLE expenses ADD COLUMN isRecurring INTEGER DEFAULT 0");
          return []; // Return empty list since we just created the column
        }
      } catch (e) {
        console.error("Error checking or adding isRecurring column:", e);
        throw e; // Rethrow to handle in the outer catch
      }
      
      const result = db.exec('SELECT * FROM expenses WHERE isRecurring = 1');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      const expenses = result[0].values.map((row: any[]) => {
        return {
          id: String(row[0]),
          title: String(row[1] || ''),
          budget: Number(row[2] || 0),
          spent: Number(row[3] || 0),
          type: 'expense' as const,
          linkedBudgetId: row[5] ? String(row[5]) : null,
          date: String(row[6] || new Date().toISOString().split('T')[0]),
          isRecurring: true
        };
      });
      
      return expenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses récurrentes:", error);
      throw error; // Rethrow to handle in the outer try/catch
    }
  },
  
  add: (db: any, expense: Expense): void => {
    if (!db) {
      console.error("Database is null in expenseQueries.add");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        String(expense.id), 
        String(expense.title || 'Sans titre'), 
        Number(expense.budget || 0), 
        Number(expense.spent || 0), 
        'expense', 
        expense.linkedBudgetId ? String(expense.linkedBudgetId) : null, 
        String(expense.date || new Date().toISOString().split('T')[0]),
        expense.isRecurring ? 1 : 0,
        expense.dashboardId ? String(expense.dashboardId) : null
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
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, isRecurring = ?, dashboardId = ? WHERE id = ?'
      );
      
      stmt.run([
        String(expense.title || 'Sans titre'),
        Number(expense.budget || 0),
        Number(expense.spent || expense.budget || 0),
        expense.linkedBudgetId ? String(expense.linkedBudgetId) : null, 
        String(expense.date || new Date().toISOString().split('T')[0]),
        expense.isRecurring ? 1 : 0,
        expense.dashboardId ? String(expense.dashboardId) : null,
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
