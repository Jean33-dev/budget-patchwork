
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
        console.log("expenseGetQueries.getAll: Checking table schema...");
        const tableInfo = db.exec("PRAGMA table_info(expenses)");
        if (tableInfo && tableInfo.length > 0 && tableInfo[0].values) {
          console.log("Table info:", tableInfo[0].values);
          hasIsRecurringColumn = tableInfo[0].values.some((col: any) => col[1] === 'isRecurring');
          hasDashboardIdColumn = tableInfo[0].values.some((col: any) => col[1] === 'dashboardId');
          
          console.log(`Schema check: isRecurring column exists: ${hasIsRecurringColumn}, dashboardId column exists: ${hasDashboardIdColumn}`);
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
      
      // Execute query with detailed logging
      console.log("Executing SELECT * FROM expenses");
      const result = db.exec('SELECT * FROM expenses');
      console.log("Raw query result:", result);
      
      if (!result || result.length === 0 || !result[0]?.values) {
        console.log("No expenses found in the database");
        return [];
      }
      
      console.log(`Found ${result[0].values.length} expense records in database`);
      console.log("Column names:", result[0].columns);
      console.log("First row sample:", result[0].values[0]);
      
      // Map database results to Expense objects
      return result[0].values.map((row: any[]) => {
        const expense = {
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
        console.log("Mapped expense:", expense);
        return expense;
      });
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
