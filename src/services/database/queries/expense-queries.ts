
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
      console.log("Executing query to get all expenses");
      const result = db.exec('SELECT * FROM expenses');
      if (!result || result.length === 0 || !result[0]?.values) {
        console.log("No expenses found in database");
        return [];
      }
      
      const expenses = result[0].values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: row[2],
        spent: row[3],
        type: row[4] as 'expense',
        linkedBudgetId: row[5],
        date: row[6]
      }));
      
      console.log(`Found ${expenses.length} expenses in database`);
      return expenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  add: (db: any, expense: Expense): void => {
    try {
      if (!expense || !expense.id) {
        throw new Error("Invalid expense data for adding");
      }
      
      console.log("Preparing to add expense:", expense);
      const stmt = db.prepare(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        expense.id, 
        expense.title, 
        expense.budget, 
        expense.spent, 
        expense.type, 
        expense.linkedBudgetId || null, 
        expense.date
      ]);
      
      stmt.free();
      console.log("Expense added successfully to database");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      throw error;
    }
  },
  
  update: (db: any, expense: Expense): void => {
    try {
      if (!expense || !expense.id) {
        throw new Error("Invalid expense data for updating");
      }
      
      console.log("Preparing to update expense:", expense);
      const stmt = db.prepare(
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?'
      );
      
      stmt.run([
        expense.title, 
        expense.budget, 
        expense.spent, 
        expense.linkedBudgetId || null, 
        expense.date,
        expense.id
      ]);
      
      stmt.free();
      console.log("Expense updated successfully in database");
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une dépense:", error);
      throw error;
    }
  },
  
  delete: (db: any, id: string): void => {
    try {
      if (!id) {
        throw new Error("ID de dépense manquant pour la suppression");
      }
      
      console.log(`Deleting expense with ID: ${id} from database`);
      
      // First check if the expense exists
      const checkStmt = db.prepare('SELECT id FROM expenses WHERE id = ?');
      checkStmt.step([id]);
      const exists = checkStmt.getAsObject();
      checkStmt.free();
      
      if (!exists.id) {
        console.warn(`Expense with ID ${id} not found for deletion`);
        return; // Don't throw error if expense doesn't exist
      }
      
      // If expense exists, delete it
      const deleteStmt = db.prepare('DELETE FROM expenses WHERE id = ?');
      deleteStmt.run([id]);
      deleteStmt.free();
      
      console.log(`Expense ${id} deleted successfully from database`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'une dépense:", error);
      throw error;
    }
  }
};
