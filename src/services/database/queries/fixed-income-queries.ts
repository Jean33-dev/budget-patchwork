
import { FixedIncome } from '../models/fixedIncome';

export const fixedIncomeQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS fixed_incomes (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      type TEXT,
      date TEXT
    )
  `,
  
  getAll: (db: any): FixedIncome[] => {
    try {
      if (!db) {
        console.error("Database is null in fixedIncomeQueries.getAll");
        return [];
      }
      
      const result = db.exec('SELECT * FROM fixed_incomes');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      const fixedIncomes = result[0].values.map((row: any[]) => {
        return {
          id: String(row[0]),
          title: String(row[1] || ''),
          budget: Number(row[2] || 0),
          type: 'income' as const,
          date: String(row[4] || new Date().toISOString().split('T')[0])
        };
      });
      
      return fixedIncomes;
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus fixes:", error);
      return [];
    }
  },
  
  add: (db: any, fixedIncome: FixedIncome): void => {
    if (!db) {
      console.error("Database is null in fixedIncomeQueries.add");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'INSERT INTO fixed_incomes (id, title, budget, type, date) VALUES (?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        String(fixedIncome.id), 
        String(fixedIncome.title || 'Sans titre'), 
        Number(fixedIncome.budget || 0), 
        'income', 
        String(fixedIncome.date || new Date().toISOString().split('T')[0])
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un revenu fixe:", error);
    }
  },
  
  update: (db: any, fixedIncome: FixedIncome): void => {
    if (!db) {
      console.error("Database is null in fixedIncomeQueries.update");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'UPDATE fixed_incomes SET title = ?, budget = ?, date = ? WHERE id = ?'
      );
      
      stmt.run([
        String(fixedIncome.title || 'Sans titre'),
        Number(fixedIncome.budget || 0),
        String(fixedIncome.date || new Date().toISOString().split('T')[0]),
        String(fixedIncome.id)
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un revenu fixe:", error);
    }
  },
  
  delete: (db: any, id: string): void => {
    if (!db) {
      console.error("Database is null in fixedIncomeQueries.delete");
      return;
    }
    
    try {
      const stmt = db.prepare('DELETE FROM fixed_incomes WHERE id = ?');
      stmt.run([String(id)]);
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la suppression d'un revenu fixe:", error);
    }
  },
  
  updateDates: (db: any, newDate: string): void => {
    if (!db) {
      console.error("Database is null in fixedIncomeQueries.updateDates");
      return;
    }
    
    try {
      const stmt = db.prepare('UPDATE fixed_incomes SET date = ?');
      stmt.run([newDate]);
      stmt.free();
      console.log("Dates des revenus fixes mises à jour vers:", newDate);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des dates des revenus fixes:", error);
    }
  }
};
