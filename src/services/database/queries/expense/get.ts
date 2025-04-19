
import { Expense } from '../../models/expense';

export const expenseGetQueries = {
  getAll: (db: any): Expense[] => {
    try {
      if (!db) {
        console.error("Database is null in expenseQueries.getAll");
        return [];
      }
      
      // Check if columns exist
      let hasIsRecurringColumn = false;
      let hasDashboardIdColumn = false;
      try {
        const tableInfo = db.exec("PRAGMA table_info(expenses)");
        if (tableInfo && tableInfo.length > 0 && tableInfo[0].values) {
          hasIsRecurringColumn = tableInfo[0].values.some((col: any) => col[1] === 'isRecurring');
          hasDashboardIdColumn = tableInfo[0].values.some((col: any) => col[1] === 'dashboardId');
        }
        
        if (!hasIsRecurringColumn) {
          db.exec("ALTER TABLE expenses ADD COLUMN isRecurring INTEGER DEFAULT 0");
        }
        
        if (!hasDashboardIdColumn) {
          db.exec("ALTER TABLE expenses ADD COLUMN dashboardId TEXT");
        }
      } catch (e) {
        console.error("Error checking or adding columns to expenses table:", e);
      }
      
      const result = db.exec('SELECT * FROM expenses');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      return result[0].values.map((row: any[]) => ({
        id: String(row[0]),
        title: String(row[1] || ''),
        budget: Number(row[2] || 0),
        spent: Number(row[3] || 0),
        type: 'expense' as const,
        linkedBudgetId: row[5] ? String(row[5]) : null,
        date: String(row[6] || new Date().toISOString().split('T')[0]),
        isRecurring: hasIsRecurringColumn ? Boolean(row[7]) : false,
        dashboardId: hasDashboardIdColumn ? (row[8] ? String(row[8]) : null) : null
      }));
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
      
      const result = db.exec('SELECT * FROM expenses WHERE isRecurring = 1');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      return result[0].values.map((row: any[]) => ({
        id: String(row[0]),
        title: String(row[1] || ''),
        budget: Number(row[2] || 0),
        spent: Number(row[3] || 0),
        type: 'expense' as const,
        linkedBudgetId: row[5] ? String(row[5]) : null,
        date: String(row[6] || new Date().toISOString().split('T')[0]),
        isRecurring: true,
        dashboardId: row[8] ? String(row[8]) : null
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses récurrentes:", error);
      throw error;
    }
  }
};
