
import { toast } from "@/components/ui/use-toast";
import { Expense } from '../models/expense';
import { BaseDatabaseManager } from '../base-database-manager';

/**
 * Responsible for handling expense-related database operations
 */
export class ExpenseManager extends BaseDatabaseManager {
  /**
   * Get all expenses from the database
   */
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return this.queryManager.executeGetExpenses();
  }

  /**
   * Add a new expense to the database
   */
  async addExpense(expense: Expense) {
    await this.ensureInitialized();
    await this.queryManager.executeAddExpense(expense);
  }

  /**
   * Update an expense in the database
   */
  async updateExpense(expense: Expense) {
    await this.ensureInitialized();
    console.log(`Mise à jour de la dépense avec l'ID: ${expense.id}`);
    await this.queryManager.executeUpdateExpense(expense);
  }

  /**
   * Delete an expense from the database
   */
  async deleteExpense(id: string) {
    await this.ensureInitialized();
    console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
    await this.queryManager.executeDeleteExpense(id);
  }
}
