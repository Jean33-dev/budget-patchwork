
import { Expense } from '../../models/expense';

export const expenseMutationQueries = {
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
        expense.dashboardId ? String(expense.dashboardId) : "default"
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
