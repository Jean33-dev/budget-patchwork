
import { Expense } from '../models/expense';
import { BaseDatabaseManager } from '../base-database-manager';
import { IExpenseManager } from '../interfaces/IExpenseManager';
import { IQueryManager } from '../interfaces/IQueryManager';
import { toast } from "@/components/ui/use-toast";

/**
 * Responsible for handling expense-related database operations
 */
export class ExpenseManager extends BaseDatabaseManager implements IExpenseManager {
  /**
   * Get all expenses from the database
   */
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return this.queryManager.executeGetExpenses();
  }

  /**
   * Get recurring expenses from the database
   */
  async getRecurringExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return this.queryManager.executeGetRecurringExpenses();
  }

  /**
   * Add a new expense to the database
   */
  async addExpense(expense: Expense): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeAddExpense(expense);
  }

  /**
   * Update an expense in the database
   */
  async updateExpense(expense: Expense): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateExpense(expense);
  }

  /**
   * Delete an expense from the database
   */
  async deleteExpense(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteExpense(id);
  }
  
  /**
   * Copy a recurring expense to a specific month
   */
  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    await this.ensureInitialized();
    
    try {
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
        isRecurring: false // The copy is not recurring
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
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
