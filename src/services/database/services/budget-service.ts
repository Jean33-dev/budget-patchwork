
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
          console.log(`BudgetService.getBudgets: Budget ${idx+1} - ID: ${budget.id}, Title: ${budget.title}, DashboardId: ${String(budget.dashboardId)}`);
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
    try {
      if (!await this.ensureInitialized()) return;
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return;
      }
      
      const now = new Date().toISOString();
      console.log(`BudgetService: Adding new budget "${budget.title}" with dashboardId "${budget.dashboardId}"...`);
      
      await adapter.run(
        'INSERT INTO budgets (id, title, budget, spent, type, carriedOver, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          budget.id, 
          budget.title, 
          budget.budget, 
          budget.spent, 
          budget.type, 
          budget.carriedOver || 0,
          budget.dashboardId
        ]
      );
      
      console.log(`BudgetService: Budget "${budget.title}" added successfully with dashboardId "${budget.dashboardId}"`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du tableau de bord:", error);
      throw error;
    }
  }

  /**
   * Updates an existing budget
   */
  async updateBudget(budget: Budget): Promise<void> {
    try {
      if (!await this.ensureInitialized()) return;
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return;
      }
      
      const now = new Date().toISOString();
      console.log(`BudgetService: Updating budget with ID ${budget.id} and dashboardId "${budget.dashboardId}"...`);
      
      await adapter.run(
        'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ?, dashboardId = ? WHERE id = ?',
        [
          budget.title, 
          budget.budget, 
          budget.spent, 
          budget.carriedOver || 0,
          budget.dashboardId,
          budget.id
        ]
      );
      
      console.log(`BudgetService: Budget with ID ${budget.id} updated successfully with dashboardId "${budget.dashboardId}"`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tableau de bord:", error);
      throw error;
    }
  }

  /**
   * Deletes a budget
   */
  async deleteBudget(id: string): Promise<void> {
    try {
      if (!await this.ensureInitialized()) return;
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return;
      }
      
      console.log(`BudgetService: Deleting budget with ID ${id}...`);
      await adapter.run('DELETE FROM budgets WHERE id = ?', [id]);
      console.log(`BudgetService: Budget with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Erreur lors de la suppression du tableau de bord:", error);
      throw error;
    }
  }
}
