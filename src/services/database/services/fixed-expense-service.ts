
import { FixedExpense } from '../models/fixedExpense';
import { BaseService } from './base-service';

/**
 * Service for handling fixed expense-related database operations
 */
export class FixedExpenseService extends BaseService {
  /**
   * Retrieves all fixed expenses
   */
  async getFixedExpenses(): Promise<FixedExpense[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM fixed_expenses");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        type: 'expense' as const,
        linkedBudgetId: row.linkedBudgetId,
        date: row.date
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses fixes:", error);
      return [];
    }
  }

  /**
   * Adds a new fixed expense
   */
  async addFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO fixed_expenses (id, title, budget, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?)',
      [fixedExpense.id, fixedExpense.title, fixedExpense.budget, fixedExpense.type, fixedExpense.linkedBudgetId, fixedExpense.date]
    );
  }

  /**
   * Updates an existing fixed expense
   */
  async updateFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE fixed_expenses SET title = ?, budget = ?, linkedBudgetId = ? WHERE id = ?',
      [fixedExpense.title, fixedExpense.budget, fixedExpense.linkedBudgetId, fixedExpense.id]
    );
  }

  /**
   * Deletes a fixed expense
   */
  async deleteFixedExpense(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM fixed_expenses WHERE id = ?', [id]);
  }
  
  /**
   * Deletes a fixed expense if it exists
   */
  async deleteFixedExpenseIfExists(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    try {
      const adapter = this.initManager.getAdapter();
      const exists = await adapter!.query('SELECT id FROM fixed_expenses WHERE id = ?', [id]);
      
      if (exists && exists.length > 0) {
        await adapter!.run('DELETE FROM fixed_expenses WHERE id = ?', [id]);
      }
    } catch (error) {
      console.error(`Error checking and deleting fixed expense ${id}:`, error);
    }
  }
  
  /**
   * Updates dates for all fixed expenses
   */
  async updateFixedExpensesDates(newDate: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('UPDATE fixed_expenses SET date = ?', [newDate]);
  }
}
