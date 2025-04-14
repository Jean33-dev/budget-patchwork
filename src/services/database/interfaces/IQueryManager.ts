
import { Income } from '../models/income';
import { Expense } from '../models/expense';
import { Budget } from '../models/budget';
import { Category } from '../models/category';
import { Dashboard } from '../models/dashboard';

export interface IQueryManager {
  // Database access
  getDb(): any;
  ensureInitialized(): Promise<boolean>;
  
  // Income operations
  executeGetIncomes(): Promise<Income[]>;
  executeGetRecurringIncomes(): Promise<Income[]>;
  executeAddIncome(income: Income): Promise<void>;
  executeUpdateIncome(income: Income): Promise<void>;
  executeDeleteIncome(id: string): Promise<void>;
  
  // Expense operations
  executeGetExpenses(): Promise<Expense[]>;
  executeGetRecurringExpenses(): Promise<Expense[]>;
  executeAddExpense(expense: Expense): Promise<void>;
  executeUpdateExpense(expense: Expense): Promise<void>;
  executeDeleteExpense(id: string): Promise<void>;
  
  // Budget operations
  executeGetBudgets(): Promise<Budget[]>;
  executeAddBudget(budget: Budget): Promise<void>;
  executeUpdateBudget(budget: Budget): Promise<void>;
  executeDeleteBudget(id: string): Promise<void>;
  
  // Category operations
  executeGetCategories(): Promise<Category[]>;
  executeAddCategory(category: Category): Promise<void>;
  executeUpdateCategory(category: Category): Promise<void>;
  executeDeleteCategory(id: string): Promise<void>;
  
  // Dashboard operations
  executeGetDashboards(): Promise<Dashboard[]>;
  executeAddDashboard(dashboard: Dashboard): Promise<void>;
  executeUpdateDashboard(dashboard: Dashboard): Promise<void>;
  executeDeleteDashboard(id: string): Promise<void>;
}
