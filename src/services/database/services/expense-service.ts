
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
      console.log("ExpenseService.getExpenses: Starting...");
      if (!await this.ensureInitialized()) {
        console.log("ExpenseService.getExpenses: Database not initialized");
        return [];
      }
      
      const adapter = this.initManager.getAdapter();
      console.log("ExpenseService.getExpenses: Database adapter retrieved, executing query");
      const results = await adapter!.query("SELECT * FROM expenses");
      console.log(`ExpenseService.getExpenses: Got ${results.length} results`, results);
      
      const expenses = results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'expense' as const,
        linkedBudgetId: row.linkedBudgetId,
        date: row.date,
        isRecurring: Boolean(row.isRecurring),
        dashboardId: row.dashboardId || null
      }));
      
      console.log(`ExpenseService.getExpenses: Mapped ${expenses.length} expense objects`);
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
        dashboardId: row.dashboardId || null
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
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, expense.dashboardId || null]
    );
  }

  /**
   * Updates an existing expense
   */
  async updateExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, isRecurring = ?, dashboardId = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, expense.dashboardId || null, expense.id]
    );
  }

  /**
   * Deletes an expense
   */
  async deleteExpense(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  /**
   * Copy a recurring expense to a specific month
   */
  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    try {
      if (!await this.ensureInitialized()) return;
      
      // Get the recurring expense
      const expenses = await this.getExpenses();
      const recurringExpense = expenses.find(expense => expense.id === expenseId && expense.isRecurring);
      
      if (!recurringExpense) {
        throw new Error("Dépense récurrente non trouvée");
      }
      
      // Create a new expense based on the recurring one
      const newExpense: Expense = {
        id: `${recurringExpense.id}_copy_${Date.now()}`,
        title: recurringExpense.title,
        budget: recurringExpense.budget,
        spent: 0, // Initialize spent to 0
        type: 'expense',
        linkedBudgetId: recurringExpense.linkedBudgetId,
        date: targetDate,
        isRecurring: false, // The copy is not recurring
        dashboardId: recurringExpense.dashboardId || null
      };
      
      await this.addExpense(newExpense);
      
      toast({
        title: "Succès",
        description: `La dépense récurrente "${recurringExpense.title}" a été ajoutée au mois actuel.`
      });
    } catch (error) {
      console.error("Erreur lors de la copie de la dépense récurrente :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier la dépense récurrente"
      });
    }
  }
}
