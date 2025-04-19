
import { Expense } from '../../models/expense';

export const expenseMutationQueries = {
  add: (db: any, expense: Expense): void => {
    if (!db) {
      console.error("Database is null in expenseQueries.add");
      return;
    }
    
    try {
      console.log("🔍 expenseMutationQueries.add - Adding expense:", expense);
      const stmt = db.prepare(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      
      const dashboardIdToUse = expense.dashboardId ? String(expense.dashboardId) : "default";
      console.log(`🔍 Using dashboardId for insert: ${dashboardIdToUse}`);
      
      const params = [
        String(expense.id), 
        String(expense.title || 'Sans titre'), 
        Number(expense.budget || 0), 
        Number(expense.spent || 0), 
        'expense', 
        expense.linkedBudgetId ? String(expense.linkedBudgetId) : null, 
        String(expense.date || new Date().toISOString().split('T')[0]),
        expense.isRecurring ? 1 : 0,
        dashboardIdToUse
      ];
      console.log("🔍 Insert params:", params);
      
      stmt.run(params);
      console.log("🔍 Expense inserted successfully");
      
      stmt.free();
    } catch (error) {
      console.error("🔍 Erreur lors de l'ajout d'une dépense:", error);
    }
  },

  update: (db: any, expense: Expense): void => {
    if (!db) {
      console.error("Database is null in expenseQueries.update");
      return;
    }
    
    try {
      console.log("🔍 expenseMutationQueries.update - Updating expense:", expense);
      const stmt = db.prepare(
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, isRecurring = ?, dashboardId = ? WHERE id = ?'
      );
      
      const dashboardIdToUse = expense.dashboardId ? String(expense.dashboardId) : null;
      console.log(`🔍 Using dashboardId for update: ${dashboardIdToUse}`);
      
      const params = [
        String(expense.title || 'Sans titre'),
        Number(expense.budget || 0),
        Number(expense.spent || expense.budget || 0),
        expense.linkedBudgetId ? String(expense.linkedBudgetId) : null, 
        String(expense.date || new Date().toISOString().split('T')[0]),
        expense.isRecurring ? 1 : 0,
        dashboardIdToUse,
        String(expense.id)
      ];
      console.log("🔍 Update params:", params);
      
      stmt.run(params);
      console.log("🔍 Expense updated successfully");
      
      stmt.free();
    } catch (error) {
      console.error("🔍 Erreur lors de la mise à jour d'une dépense:", error);
    }
  },

  delete: (db: any, id: string): void => {
    if (!db) {
      console.error("Database is null in expenseQueries.delete");
      return;
    }
    
    try {
      console.log(`🔍 expenseMutationQueries.delete - Deleting expense with ID: ${id}`);
      const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
      
      stmt.run([String(id)]);
      console.log("🔍 Expense deleted successfully");
      
      stmt.free();
    } catch (error) {
      console.error("🔍 Erreur lors de la suppression d'une dépense:", error);
    }
  }
};
