import { Expense } from '../../models/expense';
import { ExpenseBaseService } from './expense-base-service';

/**
 * Service for handling expense query operations
 */
export class ExpenseQueryService extends ExpenseBaseService {
  /**
   * Retrieves all expenses
   */
  async getExpenses(): Promise<Expense[]> {
    try {
      console.log("ExpenseQueryService.getExpenses: Starting...");
      if (!await this.ensureDatabase()) {
        return [];
      }
      
      const adapter = this.initManager.getAdapter();
      console.log("ExpenseQueryService.getExpenses: Database adapter retrieved, executing query");
      const results = await adapter!.query("SELECT * FROM expenses");
      console.log(`ExpenseQueryService.getExpenses: Got ${results.length} results`, results);
      
      // Log all dashboard IDs found in the expense records for debugging
      const dashboardIds = results.map(row => String(row.dashboardId || 'null')).join(', ');
      console.log(`ExpenseQueryService.getExpenses: Found dashboardIds: [${dashboardIds}]`);
      
      const expenses = results.map(row => {
        // Normalize dashboardId as a non-empty string
        const dashboardId = row.dashboardId && String(row.dashboardId).trim() !== "" 
          ? String(row.dashboardId) 
          : "default";
          
        return {
          id: row.id,
          title: row.title,
          budget: Number(row.budget),
          spent: Number(row.spent),
          type: 'expense' as const,
          linkedBudgetId: row.linkedBudgetId,
          date: row.date,
          isRecurring: Boolean(row.isRecurring),
          dashboardId: dashboardId // Toujours une chaîne non vide
        };
      });
      
      console.log(`ExpenseQueryService.getExpenses: Mapped ${expenses.length} expense objects`);
      
      // Detailed logging for debugging
      expenses.forEach((expense, idx) => {
        if (idx < 5) { // Limit logging to first 5 for brevity
          console.log(`ExpenseQueryService.getExpenses: Expense ${idx+1} - ID: ${expense.id}, Title: ${expense.title}, DashboardId: "${expense.dashboardId}"`);
        }
      });
      
      return expenses;
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
      if (!await this.ensureDatabase()) {
        return [];
      }
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM expenses WHERE isRecurring = 1");
      
      return results.map(row => {
        // Normalize dashboardId as a non-empty string
        const dashboardId = row.dashboardId && String(row.dashboardId).trim() !== "" 
          ? String(row.dashboardId) 
          : "default";
          
        return {
          id: row.id,
          title: row.title,
          budget: Number(row.budget),
          spent: Number(row.spent),
          type: 'expense' as const,
          linkedBudgetId: row.linkedBudgetId,
          date: row.date,
          isRecurring: true,
          dashboardId: dashboardId // Toujours une chaîne non vide
        };
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses récurrentes:", error);
      return [];
    }
  }
}
