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
      
      // Log all dashboard IDs found in the expense records for debugging
      const dashboardIds = results.map(row => String(row.dashboardId || 'null')).join(', ');
      console.log(`ExpenseService.getExpenses: Found dashboardIds: [${dashboardIds}]`);
      
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
      
      console.log(`ExpenseService.getExpenses: Mapped ${expenses.length} expense objects`);
      
      // Detailed logging for debugging
      expenses.forEach((expense, idx) => {
        if (idx < 5) { // Limit logging to first 5 for brevity
          console.log(`ExpenseService.getExpenses: Expense ${idx+1} - ID: ${expense.id}, Title: ${expense.title}, DashboardId: "${expense.dashboardId}"`);
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

  /**
   * Adds a new expense
   */
  async addExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    // Normalize dashboardId as a non-empty string
    const dashboardId = expense.dashboardId && String(expense.dashboardId).trim() !== "" 
      ? String(expense.dashboardId) 
      : "default";
      
    console.log(`ExpenseService.addExpense: Adding expense "${expense.title}" with dashboardId: "${dashboardId}"`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, dashboardId]
    );
    
    console.log(`ExpenseService.addExpense: Expense "${expense.title}" added with dashboardId: "${dashboardId}"`);
  }

  /**
   * Updates an existing expense
   */
  async updateExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    // Normalize dashboardId as a non-empty string
    const dashboardId = expense.dashboardId && String(expense.dashboardId).trim() !== "" 
      ? String(expense.dashboardId) 
      : "default";
      
    console.log(`ExpenseService.updateExpense: Updating expense "${expense.title}" with dashboardId: "${dashboardId}"`);
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, isRecurring = ?, dashboardId = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.isRecurring ? 1 : 0, dashboardId, expense.id]
    );
    
    console.log(`ExpenseService.updateExpense: Expense "${expense.title}" updated with dashboardId: "${dashboardId}"`);
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
      console.log("Détails de la dépense récurrente:", JSON.stringify(recurringExpense));
      
      // Normalize dashboardId as a non-empty string
      const dashboardId = recurringExpense.dashboardId && String(recurringExpense.dashboardId).trim() !== "" 
        ? String(recurringExpense.dashboardId) 
        : "default";
      
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
        dashboardId: dashboardId // Toujours une chaîne non vide
      };
      
      console.log("Nouvelle dépense à ajouter:", JSON.stringify(newExpense));
      
      // Vérifier que le budget associé existe toujours
      const allBudgets = await this.initManager.getAdapter()!.query("SELECT * FROM budgets WHERE id = ?", [recurringExpense.linkedBudgetId]);
      if (allBudgets.length === 0) {
        throw new Error(`Le budget associé (ID: ${recurringExpense.linkedBudgetId}) n'existe plus`);
      }
      
      // Ajouter la nouvelle dépense à la base de données
      await this.addExpense(newExpense);
      
      // Mise à jour du montant dépensé dans le budget associé
      const budgetQuery = await this.initManager.getAdapter()!.query(
        "SELECT * FROM budgets WHERE id = ?", 
        [recurringExpense.linkedBudgetId]
      );
      
      if (budgetQuery.length > 0) {
        const budget = budgetQuery[0];
        const newSpent = Number(budget.spent || 0) + Number(recurringExpense.budget);
        
        console.log(`Mise à jour du montant dépensé dans le budget ${budget.title} de ${budget.spent} à ${newSpent}`);
        
        await this.initManager.getAdapter()!.run(
          "UPDATE budgets SET spent = ? WHERE id = ?",
          [newSpent, recurringExpense.linkedBudgetId]
        );
      }
      
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
