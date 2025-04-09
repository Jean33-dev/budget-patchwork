
import { Income } from '../models/income';

export const incomeQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      type TEXT,
      date TEXT,
      isRecurring INTEGER DEFAULT 0
    )
  `,
  
  getAll: (db: any): Income[] => {
    try {
      if (!db) {
        console.error("Database is null in incomeQueries.getAll");
        return [];
      }
      
      // Check if isRecurring column exists
      let hasIsRecurringColumn = false;
      try {
        // Try to query for the column in the table info
        const tableInfo = db.exec("PRAGMA table_info(incomes)");
        if (tableInfo && tableInfo.length > 0 && tableInfo[0].values) {
          hasIsRecurringColumn = tableInfo[0].values.some((col: any) => col[1] === 'isRecurring');
        }
        
        if (!hasIsRecurringColumn) {
          console.log("Adding isRecurring column to incomes table");
          db.exec("ALTER TABLE incomes ADD COLUMN isRecurring INTEGER DEFAULT 0");
        }
      } catch (e) {
        console.error("Error checking or adding isRecurring column:", e);
      }
      
      const result = db.exec('SELECT * FROM incomes');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      return result[0].values.map((row: any[]) => ({
        id: String(row[0]),
        title: String(row[1] || ''),
        budget: Number(row[2] || 0),
        spent: Number(row[3] || 0),
        type: row[4] as 'income',
        date: String(row[5] || new Date().toISOString().split('T')[0]),
        isRecurring: hasIsRecurringColumn ? Boolean(row[6]) : false
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus:", error);
      return [];
    }
  },
  
  getRecurring: (db: any): Income[] => {
    try {
      if (!db) {
        console.error("Database is null in incomeQueries.getRecurring");
        return [];
      }
      
      // Check if isRecurring column exists
      let hasIsRecurringColumn = false;
      try {
        // Try to query for the column in the table info
        const tableInfo = db.exec("PRAGMA table_info(incomes)");
        if (tableInfo && tableInfo.length > 0 && tableInfo[0].values) {
          hasIsRecurringColumn = tableInfo[0].values.some((col: any) => col[1] === 'isRecurring');
        }
        
        if (!hasIsRecurringColumn) {
          console.log("Adding isRecurring column to incomes table");
          db.exec("ALTER TABLE incomes ADD COLUMN isRecurring INTEGER DEFAULT 0");
          return []; // Return empty list since we just created the column
        }
      } catch (e) {
        console.error("Error checking or adding isRecurring column:", e);
        throw e; // Rethrow to handle in the outer catch
      }
      
      const result = db.exec('SELECT * FROM incomes WHERE isRecurring = 1');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      return result[0].values.map((row: any[]) => ({
        id: String(row[0]),
        title: String(row[1] || ''),
        budget: Number(row[2] || 0),
        spent: Number(row[3] || 0),
        type: row[4] as 'income',
        date: String(row[5] || new Date().toISOString().split('T')[0]),
        isRecurring: true
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus récurrents:", error);
      throw error; // Rethrow to handle in the outer try/catch
    }
  },
  
  add: (db: any, income: Income): void => {
    if (!db) {
      console.error("Database is null in incomeQueries.add");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'INSERT INTO incomes (id, title, budget, spent, type, date, isRecurring) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        String(income.id), 
        String(income.title || 'Sans titre'), 
        Number(income.budget || 0), 
        Number(income.spent || 0), 
        'income', 
        String(income.date || new Date().toISOString().split('T')[0]),
        income.isRecurring ? 1 : 0
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un revenu:", error);
    }
  },
  
  update: (db: any, income: Income): void => {
    if (!db) {
      console.error("Database is null in incomeQueries.update");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'UPDATE incomes SET title = ?, budget = ?, spent = ?, isRecurring = ? WHERE id = ?'
      );
      
      stmt.run([
        String(income.title || 'Sans titre'),
        Number(income.budget || 0),
        Number(income.spent || income.budget || 0),
        income.isRecurring ? 1 : 0,
        String(income.id)
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un revenu:", error);
    }
  },
  
  delete: (db: any, id: string): void => {
    if (!db) {
      console.error("Database is null in incomeQueries.delete");
      return;
    }
    
    try {
      const stmt = db.prepare('DELETE FROM incomes WHERE id = ?');
      stmt.run([String(id)]);
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la suppression d'un revenu:", error);
    }
  }
};
