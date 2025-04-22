
import { Budget } from '../models/budget';
import { BaseService } from './base-service';

/**
 * Service for handling budget-related database operations
 */
export class BudgetService extends BaseService {
  /**
   * Retrieves all budgets
   */
  async getBudgets(): Promise<Budget[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM budgets");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'budget' as const,
        carriedOver: Number(row.carriedOver || 0),
        dashboardId: row.dashboardId || 'default' // Ajout du dashboardId avec valeur par défaut
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets:", error);
      return [];
    }
  }

  /**
   * Adds a new budget
   */
  async addBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO budgets (id, title, budget, spent, type, carriedOver, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0, budget.dashboardId]
    );
  }

  /**
   * Updates an existing budget
   */
  async updateBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ?, dashboardId = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, budget.dashboardId, budget.id]
    );
  }

  /**
   * Deletes a budget
   */
  async deleteBudget(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM budgets WHERE id = ?', [id]);
  }
}
