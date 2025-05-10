
import { Expense } from '../../models/expense';
import { ExpenseBaseService } from './expense-base-service';

/**
 * Service for handling expense mutation operations
 */
export class ExpenseMutationService extends ExpenseBaseService {
  /**
   * Adds a new expense
   */
  async addExpense(expense: Expense): Promise<void> {
    if (!await this.ensureDatabase()) return;
    
    // Normalize dashboardId as a non-empty string
    const dashboardId = expense.dashboardId && String(expense.dashboardId).trim() !== "" 
      ? String(expense.dashboardId) 
      : "default";
      
    console.log(`ExpenseMutationService.addExpense: Adding expense "${expense.title}" with dashboardId: "${dashboardId}"`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, dashboardId]
    );
    
    console.log(`ExpenseMutationService.addExpense: Expense "${expense.title}" added with dashboardId: "${dashboardId}"`);
  }

  /**
   * Updates an existing expense
   */
  async updateExpense(expense: Expense): Promise<void> {
    if (!await this.ensureDatabase()) return;
    
    // Normalize dashboardId as a non-empty string
    const dashboardId = expense.dashboardId && String(expense.dashboardId).trim() !== "" 
      ? String(expense.dashboardId) 
      : "default";
      
    console.log(`ExpenseMutationService.updateExpense: Updating expense "${expense.title}" with dashboardId: "${dashboardId}"`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, isRecurring = ?, dashboardId = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, dashboardId, expense.id]
    );
    
    console.log(`ExpenseMutationService.updateExpense: Expense "${expense.title}" updated with dashboardId: "${dashboardId}"`);
  }

  /**
   * Deletes an expense
   */
  async deleteExpense(id: string): Promise<void> {
    if (!await this.ensureDatabase()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM expenses WHERE id = ?', [id]);
  }
}
