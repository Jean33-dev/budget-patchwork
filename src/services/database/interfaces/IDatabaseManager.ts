
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Income } from '../models/income';
import { Category } from '../models/category';
import { FixedExpense } from '../models/fixedExpense';
import { FixedIncome } from '../models/fixedIncome';

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
  addExpense(expense: Expense): Promise<void>;
  updateExpense(expense: Expense): Promise<void>;
  deleteExpense(id: string): Promise<void>;
  
  // Income operations
  getIncomes(): Promise<Income[]>;
  addIncome(income: Income): Promise<void>;
  updateIncome(income: Income): Promise<void>;
  deleteIncome(id: string): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  addCategory(category: Category): Promise<void>;
  updateCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  resetCategoryExpenses(categoryId: string): Promise<void>;
  
  // Fixed Expense operations
  getFixedExpenses(): Promise<FixedExpense[]>;
  addFixedExpense(fixedExpense: FixedExpense): Promise<void>;
  updateFixedExpense(fixedExpense: FixedExpense): Promise<void>;
  deleteFixedExpense(id: string): Promise<void>;
  deleteFixedExpenseIfExists(id: string): Promise<void>;
  updateFixedExpensesDates(newDate: string): Promise<void>;
  
  // Fixed Income operations
  getFixedIncomes(): Promise<FixedIncome[]>;
  addFixedIncome(fixedIncome: FixedIncome): Promise<void>;
  updateFixedIncome(fixedIncome: FixedIncome): Promise<void>;
  deleteFixedIncome(id: string): Promise<void>;
  deleteFixedIncomeIfExists(id: string): Promise<void>;
  updateFixedIncomesDates(newDate: string): Promise<void>;
}
