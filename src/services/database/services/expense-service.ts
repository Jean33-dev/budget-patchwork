
import { toast } from "@/components/ui/use-toast";
import { Expense } from '../models/expense';
import { BaseService } from './base-service';
import { ExpenseQueryService } from './expense/expense-query-service';
import { ExpenseMutationService } from './expense/expense-mutation-service';
import { ExpenseRecurringService } from './expense/expense-recurring-service';

/**
 * Facade service for handling expense-related database operations
 * This maintains the original API while delegating to specialized services
 */
export class ExpenseService extends BaseService {
  private queryService: ExpenseQueryService;
  private mutationService: ExpenseMutationService;
  private recurringService: ExpenseRecurringService;

  constructor() {
    super();
    this.queryService = new ExpenseQueryService();
    this.mutationService = new ExpenseMutationService();
    this.recurringService = new ExpenseRecurringService();
  }

  /**
   * Initialize the database and all specialized services
   */
  async init(): Promise<boolean> {
    try {
      // Initialize the base service
      const baseInitSuccess = await super.init();
      if (!baseInitSuccess) {
        return false;
      }

      // Share the initialization manager with all specialized services using the setter method
      this.queryService.setInitManager(this.initManager);
      this.mutationService.setInitManager(this.initManager);
      this.recurringService.setInitManager(this.initManager);

      return true;
    } catch (error) {
      console.error("Error initializing expense services:", error);
      return false;
    }
  }

  /**
   * Retrieves all expenses
   */
  async getExpenses(): Promise<Expense[]> {
    return this.queryService.getExpenses();
  }

  /**
   * Retrieves recurring expenses
   */
  async getRecurringExpenses(): Promise<Expense[]> {
    return this.queryService.getRecurringExpenses();
  }

  /**
   * Adds a new expense
   */
  async addExpense(expense: Expense): Promise<void> {
    return this.mutationService.addExpense(expense);
  }

  /**
   * Updates an existing expense
   */
  async updateExpense(expense: Expense): Promise<void> {
    return this.mutationService.updateExpense(expense);
  }

  /**
   * Deletes an expense
   */
  async deleteExpense(id: string): Promise<void> {
    return this.mutationService.deleteExpense(id);
  }

  /**
   * Copy a recurring expense to a specific month
   */
  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    return this.recurringService.copyRecurringExpenseToMonth(expenseId, targetDate);
  }
}
