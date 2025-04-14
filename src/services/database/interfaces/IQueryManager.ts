
import { Database } from "sql.js";

/**
 * Interface for query managers
 */
export interface IQueryManager {
  getDb(): Database;
  setDb(db: Database): void;
  ensureInitialized(): Promise<boolean>;
  executeGetBudgets(): Promise<any[]>;
  executeAddBudget(budget: any): Promise<void>;
  executeUpdateBudget(budget: any): Promise<void>;
  executeDeleteBudget(id: string): Promise<void>;
  executeGetCategories(): Promise<any[]>;
  executeAddCategory(category: any): Promise<void>;
  executeUpdateCategory(category: any): Promise<void>;
  executeDeleteCategory(id: string): Promise<void>;
  executeGetExpenses(): Promise<any[]>;
  executeAddExpense(expense: any): Promise<void>;
  executeUpdateExpense(expense: any): Promise<void>;
  executeDeleteExpense(id: string): Promise<void>;
  executeGetIncomes(): Promise<any[]>;
  executeAddIncome(income: any): Promise<void>;
  executeUpdateIncome(income: any): Promise<void>;
  executeDeleteIncome(id: string): Promise<void>;
  executeGetDashboards(): Promise<any[]>;
  executeAddDashboard(dashboard: any): Promise<void>;
  executeUpdateDashboard(dashboard: any): Promise<void>;
  executeDeleteDashboard(id: string): Promise<void>;
}
