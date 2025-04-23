
import { Expense } from '../models/expense';
import { BaseService } from './base-service';
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

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
      
      // Log all dashboard IDs found in the expense records
      const dashboardIds = results.map(row => row.dashboardId || 'null').join(', ');
      console.log(`ExpenseService.getExpenses: Found dashboardIds: [${dashboardIds}]`);
      
      const expenses = results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'expense' as const,
        linkedBudgetId: row.linkedBudgetId,
        date: row.date,
        isRecurring: Boolean(row.isRecurring),
        dashboardId: row.dashboardId ? String(row.dashboardId) : null
      }));
      
      console.log(`ExpenseService.getExpenses: Mapped ${expenses.length} expense objects`);
      
      // Detailed logging for debugging
      expenses.forEach((expense, idx) => {
        if (idx < 5) { // Limit logging to first 5 for brevity
          console.log(`ExpenseService.getExpenses: Expense ${idx+1} - ID: ${expense.id}, Title: ${expense.title}, DashboardId: ${expense.dashboardId}`);
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
    
    const dashboardId = expense.dashboardId ? String(expense.dashboardId) : null;
    console.log(`ExpenseService.addExpense: Adding expense with dashboardId: ${dashboardId}`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, dashboardId]
    );
    
    console.log(`ExpenseService.addExpense: Expense added with dashboardId: ${dashboardId}`);
  }

  /**
   * Updates an existing expense
   */
  async updateExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const dashboardId = expense.dashboardId ? String(expense.dashboardId) : null;
    console.log(`ExpenseService.updateExpense: Updating expense with dashboardId: ${dashboardId}`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, isRecurring = ?, dashboardId = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, dashboardId, expense.id]
    );
    
    console.log(`ExpenseService.updateExpense: Expense updated with dashboardId: ${dashboardId}`);
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
      
      console.log(`Copie de la dépense récurrente "${recurringExpense.title}" au mois actuel...`);
      
      // Create a new expense based on the recurring one with a guaranteed unique ID
      const newExpense: Expense = {
        id: uuidv4(), // Utiliser UUID pour garantir l'unicité
        title: recurringExpense.title,
        budget: recurringExpense.budget,
        spent: recurringExpense.budget, // Définir spent = budget
        type: 'expense',
        linkedBudgetId: recurringExpense.linkedBudgetId,
        date: targetDate,
        isRecurring: false, // The copy is not recurring
        dashboardId: recurringExpense.dashboardId // Conserver le même dashboardId
      };
      
      console.log("Nouvelle dépense à ajouter:", newExpense);
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
