
import { Budget } from './models/budget';
import { Expense } from './models/expense';
import { Income } from './models/income';
import { Category } from './models/category';
import { FixedExpense } from './models/fixedExpense';
import { FixedIncome } from './models/fixedIncome';
import { BudgetQueryManager } from './query-managers/budget-query-manager';
import { ExpenseQueryManager } from './query-managers/expense-query-manager';
import { IncomeQueryManager } from './query-managers/income-query-manager';
import { CategoryQueryManager } from './query-managers/category-query-manager';
import { FixedIncomeQueryManager } from './query-managers/fixed-income-query-manager';
import { FixedExpenseQueryManager } from './query-managers/fixed-expense-query-manager';
import { IQueryManager } from './interfaces/IQueryManager';

/**
 * Main query manager that delegates to specialized query managers
 */
export class QueryManager implements IQueryManager {
  private db: any;
  private initialized: boolean = false;
  private initPromise: Promise<boolean> | null = null;
  
  // Specialized query managers
  private budgetQueryManager: BudgetQueryManager;
  private expenseQueryManager: ExpenseQueryManager;
  private incomeQueryManager: IncomeQueryManager;
  private categoryQueryManager: CategoryQueryManager;
  private fixedIncomeQueryManager: FixedIncomeQueryManager;
  private fixedExpenseQueryManager: FixedExpenseQueryManager;
  
  constructor() {
    this.budgetQueryManager = new BudgetQueryManager(this);
    this.expenseQueryManager = new ExpenseQueryManager(this);
    this.incomeQueryManager = new IncomeQueryManager(this);
    this.categoryQueryManager = new CategoryQueryManager(this);
    this.fixedIncomeQueryManager = new FixedIncomeQueryManager(this);
    this.fixedExpenseQueryManager = new FixedExpenseQueryManager(this);
  }
  
  setDb(db: any): void {
    this.db = db;
  }
  
  getDb(): any {
    return this.db;
  }
  
  setInitialized(value: boolean): void {
    this.initialized = value;
  }
  
  async ensureInitialized(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }
    
    return false;
  }

  // Budget operations
  async executeGetBudgets(): Promise<Budget[]> {
    return this.budgetQueryManager.getAll();
  }
  
  async executeAddBudget(budget: Budget): Promise<void> {
    await this.budgetQueryManager.add(budget);
  }
  
  async executeUpdateBudget(budget: Budget): Promise<void> {
    await this.budgetQueryManager.update(budget);
  }
  
  async executeDeleteBudget(id: string): Promise<void> {
    await this.budgetQueryManager.delete(id);
  }
  
  // Expense operations
  async executeGetExpenses(): Promise<Expense[]> {
    return this.expenseQueryManager.getAll();
  }
  
  async executeAddExpense(expense: Expense): Promise<void> {
    await this.expenseQueryManager.add(expense);
  }
  
  async executeUpdateExpense(expense: Expense): Promise<void> {
    await this.expenseQueryManager.update(expense);
  }
  
  async executeDeleteExpense(id: string): Promise<void> {
    await this.expenseQueryManager.delete(id);
  }
  
  // Income operations
  async executeGetIncomes(): Promise<Income[]> {
    return this.incomeQueryManager.getAll();
  }
  
  async executeAddIncome(income: Income): Promise<void> {
    await this.incomeQueryManager.add(income);
  }
  
  async executeUpdateIncome(income: Income): Promise<void> {
    await this.incomeQueryManager.update(income);
  }
  
  async executeDeleteIncome(id: string): Promise<void> {
    await this.incomeQueryManager.delete(id);
  }
  
  // Category operations
  async executeGetCategories(): Promise<Category[]> {
    return this.categoryQueryManager.getAll();
  }
  
  async executeAddCategory(category: Category): Promise<void> {
    await this.categoryQueryManager.add(category);
  }
  
  async executeUpdateCategory(category: Category): Promise<void> {
    await this.categoryQueryManager.update(category);
  }
  
  async executeDeleteCategory(id: string): Promise<void> {
    await this.categoryQueryManager.delete(id);
  }
  
  // Fixed Income operations
  async executeGetFixedIncomes(): Promise<FixedIncome[]> {
    return this.fixedIncomeQueryManager.getAll();
  }
  
  async executeAddFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    await this.fixedIncomeQueryManager.add(fixedIncome);
  }
  
  async executeUpdateFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    await this.fixedIncomeQueryManager.update(fixedIncome);
  }
  
  async executeDeleteFixedIncome(id: string): Promise<void> {
    await this.fixedIncomeQueryManager.delete(id);
  }
  
  async executeDeleteFixedIncomeIfExists(id: string): Promise<void> {
    await this.fixedIncomeQueryManager.deleteIfExists(id);
  }
  
  async executeUpdateFixedIncomesDates(newDate: string): Promise<void> {
    await this.fixedIncomeQueryManager.updateDates(newDate);
  }
  
  // Fixed Expense operations
  async executeGetFixedExpenses(): Promise<FixedExpense[]> {
    return this.fixedExpenseQueryManager.getAll();
  }
  
  async executeAddFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    await this.fixedExpenseQueryManager.add(fixedExpense);
  }
  
  async executeUpdateFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    await this.fixedExpenseQueryManager.update(fixedExpense);
  }
  
  async executeDeleteFixedExpense(id: string): Promise<void> {
    await this.fixedExpenseQueryManager.delete(id);
  }
  
  async executeDeleteFixedExpenseIfExists(id: string): Promise<void> {
    await this.fixedExpenseQueryManager.deleteIfExists(id);
  }
  
  async executeUpdateFixedExpensesDates(newDate: string): Promise<void> {
    await this.fixedExpenseQueryManager.updateDates(newDate);
  }
}
