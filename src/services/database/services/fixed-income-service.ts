
import { FixedIncome } from '../models/fixedIncome';
import { BaseService } from './base-service';

/**
 * Service for handling fixed income-related database operations
 */
export class FixedIncomeService extends BaseService {
  /**
   * Retrieves all fixed incomes
   */
  async getFixedIncomes(): Promise<FixedIncome[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM fixed_incomes");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        type: 'income' as const,
        date: row.date
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus fixes:", error);
      return [];
    }
  }

  /**
   * Adds a new fixed income
   */
  async addFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO fixed_incomes (id, title, budget, type, date) VALUES (?, ?, ?, ?, ?)',
      [fixedIncome.id, fixedIncome.title, fixedIncome.budget, fixedIncome.type, fixedIncome.date]
    );
  }

  /**
   * Updates an existing fixed income
   */
  async updateFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE fixed_incomes SET title = ?, budget = ? WHERE id = ?',
      [fixedIncome.title, fixedIncome.budget, fixedIncome.id]
    );
  }

  /**
   * Deletes a fixed income
   */
  async deleteFixedIncome(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM fixed_incomes WHERE id = ?', [id]);
  }
  
  /**
   * Deletes a fixed income if it exists
   */
  async deleteFixedIncomeIfExists(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    try {
      const adapter = this.initManager.getAdapter();
      const exists = await adapter!.query('SELECT id FROM fixed_incomes WHERE id = ?', [id]);
      
      if (exists && exists.length > 0) {
        await adapter!.run('DELETE FROM fixed_incomes WHERE id = ?', [id]);
      }
    } catch (error) {
      console.error(`Error checking and deleting fixed income ${id}:`, error);
    }
  }
  
  /**
   * Updates dates for all fixed incomes
   */
  async updateFixedIncomesDates(newDate: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('UPDATE fixed_incomes SET date = ?', [newDate]);
  }
}
