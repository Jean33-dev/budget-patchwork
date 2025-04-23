
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
      
      // Log all dashboard IDs found in the budget records
      const dashboardIds = results.map(row => row.dashboardId || 'null').join(', ');
      console.log(`BudgetService.getBudgets: Found dashboardIds: [${dashboardIds}]`);
      
      // Detailed logging for debugging
      results.forEach((budget, idx) => {
        if (idx < 5) { // Limit logging to first 5 for brevity
          console.log(`BudgetService.getBudgets: Budget ${idx+1} - ID: ${budget.id}, Title: ${budget.title}, DashboardId: ${budget.dashboardId}`);
        }
      });
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'budget' as const,
        carriedOver: Number(row.carriedOver || 0),
        dashboardId: row.dashboardId ? String(row.dashboardId) : null
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
    
    const dashboardId = budget.dashboardId ? String(budget.dashboardId) : null;
    console.log(`BudgetService.addBudget: Adding budget with dashboardId: ${dashboardId}`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO budgets (id, title, budget, spent, type, carriedOver, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0, dashboardId]
    );
    
    console.log(`BudgetService.addBudget: Budget added with dashboardId: ${dashboardId}`);
  }

  /**
   * Updates an existing budget
   */
  async updateBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const dashboardId = budget.dashboardId ? String(budget.dashboardId) : null;
    console.log(`BudgetService.updateBudget: Updating budget with dashboardId: ${dashboardId}`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ?, dashboardId = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, dashboardId, budget.id]
    );
    
    console.log(`BudgetService.updateBudget: Budget updated with dashboardId: ${dashboardId}`);
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
