
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Income } from '../models/income';
import { Category } from '../models/category';
import { FixedExpense } from '../models/fixedExpense';
import { FixedIncome } from '../models/fixedIncome';

/**
 * Interface for query manager operations
 */
export interface IQueryManager {
  setDb(db: any): void;
  getDb(): any;
  setInitialized(value: boolean): void;
  ensureInitialized(): Promise<boolean>;
  
  // Income query operations
  executeGetIncomes(): Promise<Income[]>;
  executeAddIncome(income: Income): Promise<void>;
  executeUpdateIncome(income: Income): Promise<void>;
  executeDeleteIncome(id: string): Promise<void>;
  
  // Expense query operations
  executeGetExpenses(): Promise<Expense[]>;
  executeAddExpense(expense: Expense): Promise<void>;
  executeUpdateExpense(expense: Expense): Promise<void>;
  executeDeleteExpense(id: string): Promise<void>;
  
  // Budget query operations
  executeGetBudgets(): Promise<Budget[]>;
  executeAddBudget(budget: Budget): Promise<void>;
  executeUpdateBudget(budget: Budget): Promise<void>;
  executeDeleteBudget(id: string): Promise<void>;
  
  // Category query operations
  executeGetCategories(): Promise<Category[]>;
  executeAddCategory(category: Category): Promise<void>;
  executeUpdateCategory(category: Category): Promise<void>;
  executeDeleteCategory(id: string): Promise<void>;
  
  // Fixed Income query operations
  executeGetFixedIncomes(): Promise<FixedIncome[]>;
  executeAddFixedIncome(fixedIncome: FixedIncome): Promise<void>;
  executeUpdateFixedIncome(fixedIncome: FixedIncome): Promise<void>;
  executeDeleteFixedIncome(id: string): Promise<void>;
  executeDeleteFixedIncomeIfExists(id: string): Promise<void>;
  executeUpdateFixedIncomesDates(newDate: string): Promise<void>;
  
  // Fixed Expense query operations
  executeGetFixedExpenses(): Promise<FixedExpense[]>;
  executeAddFixedExpense(fixedExpense: FixedExpense): Promise<void>;
  executeUpdateFixedExpense(fixedExpense: FixedExpense): Promise<void>;
  executeDeleteFixedExpense(id: string): Promise<void>;
  executeDeleteFixedExpenseIfExists(id: string): Promise<void>;
  executeUpdateFixedExpensesDates(newDate: string): Promise<void>;
}
