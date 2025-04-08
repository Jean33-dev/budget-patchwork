
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Income } from '../models/income';
import { Category } from '../models/category';

/**
 * Interface for query manager operations
 */
export interface IQueryManager {
  setDb(db: any): void;
  getDb(): any;
  setInitialized(value: boolean): void;
  ensureInitialized(): Promise<boolean>;
  
  // Query execution methods
  executeGetIncomes(): Promise<Income[]>;
  executeGetRecurringIncomes(): Promise<Income[]>;
  executeAddIncome(income: Income): Promise<void>;
  executeUpdateIncome(income: Income): Promise<void>;
  executeDeleteIncome(id: string): Promise<void>;
  
  executeGetExpenses(): Promise<Expense[]>;
  executeGetRecurringExpenses(): Promise<Expense[]>;
  executeAddExpense(expense: Expense): Promise<void>;
  executeUpdateExpense(expense: Expense): Promise<void>;
  executeDeleteExpense(id: string): Promise<void>;
  
  executeGetBudgets(): Promise<Budget[]>;
  executeAddBudget(budget: Budget): Promise<void>;
  executeUpdateBudget(budget: Budget): Promise<void>;
  executeDeleteBudget(id: string): Promise<void>;
  
  executeGetCategories(): Promise<Category[]>;
  executeAddCategory(category: Category): Promise<void>;
  executeUpdateCategory(category: Category): Promise<void>;
  executeDeleteCategory(id: string): Promise<void>;
}
