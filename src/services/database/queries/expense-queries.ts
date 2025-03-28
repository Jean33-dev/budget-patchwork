
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
      
      if (!db) {
        console.error("Database is null in expenseQueries.getAll");
        return [];
      }
      
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
        type: 'expense' as const,
        linkedBudgetId: row[5],
        date: row[6] || new Date().toISOString().split('T')[0]
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
      if (!db) {
        throw new Error("Database is null in expenseQueries.add");
      }
      
      if (!expense || !expense.id) {
        throw new Error("Invalid expense data for adding");
      }
      
      console.log("Preparing to add expense:", expense);
      
      // Vérifie d'abord si la dépense existe déjà
      const checkStmt = db.prepare('SELECT id FROM expenses WHERE id = ?');
      checkStmt.bind([expense.id]);
      const exists = checkStmt.step();
      checkStmt.free();
      
      if (exists) {
        console.warn(`Expense with ID ${expense.id} already exists`);
        throw new Error(`Expense with ID ${expense.id} already exists`);
      }
      
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
      console.log("Expense added successfully to database");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      throw error;
    }
  },
  
  update: (db: any, expense: Expense): void => {
    try {
      if (!db) {
        throw new Error("Database is null in expenseQueries.update");
      }
      
      if (!expense || !expense.id) {
        throw new Error("Invalid expense data for updating");
      }
      
      console.log("Updating expense with ID:", expense.id);
      
      // First check if the expense exists
      const checkStmt = db.prepare('SELECT id FROM expenses WHERE id = ?');
      checkStmt.bind([expense.id]);
      const exists = checkStmt.step();
      checkStmt.free();
      
      if (!exists) {
        console.warn(`Expense with ID ${expense.id} not found for update`);
        return; // Exit without throwing error
      }
      
      // Validate data before update
      const validTitle = expense.title || 'Sans titre';
      const validBudget = isNaN(Number(expense.budget)) ? 0 : Number(expense.budget);
      const validSpent = isNaN(Number(expense.spent)) ? validBudget : Number(expense.spent);
      const validDate = expense.date || new Date().toISOString().split('T')[0];
      
      const stmt = db.prepare(
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?'
      );
      
      stmt.run([
        validTitle,
        validBudget,
        validSpent,
        expense.linkedBudgetId || null, 
        validDate,
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
      if (!db) {
        throw new Error("Database is null in expenseQueries.delete");
      }
      
      if (!id) {
        throw new Error("ID de dépense manquant pour la suppression");
      }
      
      console.log(`Deleting expense with ID: ${id} from database`);
      
      // First check if the expense exists
      const checkStmt = db.prepare('SELECT id FROM expenses WHERE id = ?');
      checkStmt.bind([id]);
      const exists = checkStmt.step();
      checkStmt.free();
      
      if (!exists) {
        console.warn(`Expense with ID ${id} not found for deletion`);
        return; // Exit without throwing error
      }
      
      // Delete the expense
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
