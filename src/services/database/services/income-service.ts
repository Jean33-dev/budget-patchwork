
import { Income } from '../models/income';
import { BaseService } from './base-service';

/**
 * Service for handling income-related database operations
 */
export class IncomeService extends BaseService {
  /**
   * Retrieves all incomes
   */
  async getIncomes(): Promise<Income[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM incomes");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'income' as const,
        date: row.date
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus:", error);
      return [];
    }
  }

  /**
   * Adds a new income
   */
  async addIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO incomes (id, title, budget, spent, type, date) VALUES (?, ?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type, income.date]
    );
  }

  /**
   * Updates an existing income
   */
  async updateIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.id]
    );
  }

  /**
   * Deletes an income
   */
  async deleteIncome(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM incomes WHERE id = ?', [id]);
  }
}
