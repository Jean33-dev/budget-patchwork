
import { Expense } from '../models/expense';
import { BaseService } from './base-service';
import { toast } from "@/components/ui/use-toast";

/**
 * Service for handling expense-related database operations
 */
export class ExpenseService extends BaseService {
  /**
   * Retrieves all expenses
   */
  async getExpenses(): Promise<Expense[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM expenses");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'expense' as const,
        linkedBudgetId: row.linkedBudgetId,
        date: row.date,
        isRecurring: Boolean(row.isRecurring),
        dashboardId: row.dashboardId // Assurez-vous que le dashboardId est récupéré
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  }

  /**
   * Retrieves recurring expenses
   */
  async getRecurringExpenses(): Promise<Expense[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM expenses WHERE isRecurring = 1");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'expense' as const,
        linkedBudgetId: row.linkedBudgetId,
        date: row.date,
        isRecurring: true,
        dashboardId: row.dashboardId // Assurez-vous que le dashboardId est récupéré
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses récurrentes:", error);
      return [];
    }
  }

  /**
   * Adds a new expense
   */
  async addExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    try {
      console.log("ExpenseService.addExpense - Adding expense:", expense);
      
      const adapter = this.initManager.getAdapter();
      await adapter!.run(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          expense.id, 
          expense.title, 
          expense.budget, 
          expense.spent, 
          expense.type, 
          expense.linkedBudgetId, 
          expense.date, 
          expense.isRecurring ? 1 : 0,
          expense.dashboardId || 'default'
        ]
      );
      
      console.log("ExpenseService.addExpense - Expense added successfully");
    } catch (error) {
      console.error("ExpenseService.addExpense - Error adding expense:", error);
      throw error;
    }
  }

  /**
   * Updates an existing expense
   */
  async updateExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    try {
      console.log("ExpenseService.updateExpense - Updating expense:", expense);
      
      const adapter = this.initManager.getAdapter();
      await adapter!.run(
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, isRecurring = ?, dashboardId = ? WHERE id = ?',
        [
          expense.title, 
          expense.budget, 
          expense.spent, 
          expense.linkedBudgetId, 
          expense.date, 
          expense.isRecurring ? 1 : 0, 
          expense.dashboardId || 'default',
          expense.id
        ]
      );
      
      console.log("ExpenseService.updateExpense - Expense updated successfully");
    } catch (error) {
      console.error("ExpenseService.updateExpense - Error updating expense:", error);
      throw error;
    }
  }

  /**
   * Deletes an expense
   */
  async deleteExpense(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    try {
      console.log(`ExpenseService.deleteExpense - Deleting expense with ID: ${id}`);
      
      const adapter = this.initManager.getAdapter();
      await adapter!.run('DELETE FROM expenses WHERE id = ?', [id]);
      
      console.log(`ExpenseService.deleteExpense - Expense ${id} deleted successfully`);
    } catch (error) {
      console.error(`ExpenseService.deleteExpense - Error deleting expense ${id}:`, error);
      throw error;
    }
  }

  /**
   * Copy a recurring expense to a specific month
   */
  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    try {
      console.log(`ExpenseService.copyRecurringExpenseToMonth - Copying expense ${expenseId} to ${targetDate}`);
      
      // Get the recurring expense
      const expenses = await this.getExpenses();
      const recurringExpense = expenses.find(expense => expense.id === expenseId && expense.isRecurring);
      
      if (!recurringExpense) {
        throw new Error("Recurring expense not found");
      }
      
      // Create a new expense based on the recurring one
      const newExpense: Expense = {
        id: `${recurringExpense.id}_copy_${Date.now()}`,
        title: recurringExpense.title,
        budget: recurringExpense.budget,
        spent: 0,
        type: 'expense',
        linkedBudgetId: recurringExpense.linkedBudgetId,
        date: targetDate,
        isRecurring: false, // The copy is not recurring
        dashboardId: recurringExpense.dashboardId // Conserver le dashboard de l'original
      };
      
      await this.addExpense(newExpense);
      
      console.log(`ExpenseService.copyRecurringExpenseToMonth - Expense copied successfully`);
      
      toast({
        title: "Succès",
        description: `La dépense récurrente "${recurringExpense.title}" a été ajoutée au mois sélectionné.`
      });
    } catch (error) {
      console.error("ExpenseService.copyRecurringExpenseToMonth - Error copying recurring expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier la dépense récurrente"
      });
      throw error;
    }
  }
}
