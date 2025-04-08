
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Income } from '../models/income';
import { Category } from '../models/category';

/**
 * Interface defining all database operations
 */
export interface IDatabaseManager {
  // Initialization
  init(): Promise<boolean>;
  isInitialized(): boolean;
  exportData(): any;
  migrateFromLocalStorage(): Promise<boolean>;
  
  // Budget operations
  getBudgets(): Promise<Budget[]>;
  addBudget(budget: Budget): Promise<void>;
  updateBudget(budget: Budget): Promise<void>;
  deleteBudget(id: string): Promise<void>;
  
  // Expense operations
  getExpenses(): Promise<Expense[]>;
  getRecurringExpenses(): Promise<Expense[]>;
  addExpense(expense: Expense): Promise<void>;
  updateExpense(expense: Expense): Promise<void>;
  deleteExpense(id: string): Promise<void>;
  copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void>;
  
  // Income operations
  getIncomes(): Promise<Income[]>;
  getRecurringIncomes(): Promise<Income[]>;
  addIncome(income: Income): Promise<void>;
  updateIncome(income: Income): Promise<void>;
  deleteIncome(id: string): Promise<void>;
  copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  addCategory(category: Category): Promise<void>;
  updateCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  resetCategoryExpenses(categoryId: string): Promise<void>;
}
