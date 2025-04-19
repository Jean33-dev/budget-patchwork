
import { toast } from "@/components/ui/use-toast";
import { Expense } from '../models/expense';
import { DatabaseManagerFactory } from '../database-manager-factory';

export class ExpenseOperationsManager {
  private ensureInitialized: () => Promise<boolean>;
  private managerFactory: DatabaseManagerFactory;

  constructor(
    ensureInitialized: () => Promise<boolean>,
    managerFactory: DatabaseManagerFactory
  ) {
    this.ensureInitialized = ensureInitialized;
    this.managerFactory = managerFactory;
  }

  async getExpenses(): Promise<Expense[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getExpenses");
        return [];
      }
      return this.managerFactory.getExpenseManager().getExpenses();
    } catch (error) {
      console.error("Error in getExpenses:", error);
      return [];
    }
  }

  async getRecurringExpenses(): Promise<Expense[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getRecurringExpenses");
        return [];
      }
      return this.managerFactory.getExpenseManager().getRecurringExpenses();
    } catch (error) {
      console.error("Error in getRecurringExpenses:", error);
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addExpense");
    }
    await this.managerFactory.getExpenseManager().addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateExpense");
    }
    await this.managerFactory.getExpenseManager().updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteExpense");
    }
    await this.managerFactory.getExpenseManager().deleteExpense(id);
  }

  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in copyRecurringExpenseToMonth");
    }
    await this.managerFactory.getExpenseManager().copyRecurringExpenseToMonth(expenseId, targetDate);
  }
}
