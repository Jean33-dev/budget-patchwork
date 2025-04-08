
import { Expense } from '../models/expense';
import { IQueryManager } from './IQueryManager';

/**
 * Interface for expense manager operations
 */
export interface IExpenseManager {
  setDb(db: any): void;
  setInitialized(value: boolean): void;
  setQueryManager(queryManager: IQueryManager): void;
  
  getExpenses(): Promise<Expense[]>;
  getRecurringExpenses(): Promise<Expense[]>;
  addExpense(expense: Expense): Promise<void>;
  updateExpense(expense: Expense): Promise<void>;
  deleteExpense(id: string): Promise<void>;
  copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void>;
}
