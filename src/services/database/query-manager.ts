
import { BaseDatabaseManager } from './base-database-manager';
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { IncomeQueryManager } from './query-managers/income-query-manager';
import { ExpenseQueryManager } from './query-managers/expense-query-manager';
import { BudgetQueryManager } from './query-managers/budget-query-manager';
import { CategoryQueryManager } from './query-managers/category-query-manager';
import { IQueryManager } from './interfaces/IQueryManager';

export class QueryManager extends BaseDatabaseManager implements IQueryManager {
  private incomeQueryManager: IncomeQueryManager;
  private expenseQueryManager: ExpenseQueryManager;
  private budgetQueryManager: BudgetQueryManager;
  private categoryQueryManager: CategoryQueryManager;

  constructor() {
    super();
    this.incomeQueryManager = new IncomeQueryManager(this);
    this.expenseQueryManager = new ExpenseQueryManager(this);
    this.budgetQueryManager = new BudgetQueryManager(this);
    this.categoryQueryManager = new CategoryQueryManager(this);
  }

  // Méthodes pour permettre aux query managers d'accéder à la base de données
  getDb(): any {
    return this.db;
  }

  // Expose ensureInitialized aux gestionnaires de requête
  async ensureInitialized(): Promise<boolean> {
    return super.ensureInitialized();
  }

  // Income operations
  async executeGetIncomes(): Promise<Income[]> {
    return this.incomeQueryManager.getAll();
  }

  async executeGetRecurringIncomes(): Promise<Income[]> {
    return this.incomeQueryManager.getRecurring();
  }

  async executeAddIncome(income: Income): Promise<void> {
    return this.incomeQueryManager.add(income);
  }

  async executeUpdateIncome(income: Income): Promise<void> {
    return this.incomeQueryManager.update(income);
  }

  async executeDeleteIncome(id: string): Promise<void> {
    return this.incomeQueryManager.delete(id);
  }

  // Expense operations
  async executeGetExpenses(): Promise<Expense[]> {
    return this.expenseQueryManager.getAll();
  }

  async executeGetRecurringExpenses(): Promise<Expense[]> {
    return this.expenseQueryManager.getRecurring();
  }

  async executeAddExpense(expense: Expense): Promise<void> {
    return this.expenseQueryManager.add(expense);
  }

  async executeUpdateExpense(expense: Expense): Promise<void> {
    return this.expenseQueryManager.update(expense);
  }

  async executeDeleteExpense(id: string): Promise<void> {
    return this.expenseQueryManager.delete(id);
  }

  // Budget operations
  async executeGetBudgets(): Promise<Budget[]> {
    return this.budgetQueryManager.getAll();
  }

  async executeAddBudget(budget: Budget): Promise<void> {
    return this.budgetQueryManager.add(budget);
  }

  async executeUpdateBudget(budget: Budget): Promise<void> {
    return this.budgetQueryManager.update(budget);
  }

  async executeDeleteBudget(id: string): Promise<void> {
    return this.budgetQueryManager.delete(id);
  }

  // Category operations
  async executeGetCategories(): Promise<Category[]> {
    return this.categoryQueryManager.getAll();
  }

  async executeAddCategory(category: Category): Promise<void> {
    return this.categoryQueryManager.add(category);
  }

  async executeUpdateCategory(category: Category): Promise<void> {
    return this.categoryQueryManager.update(category);
  }

  async executeDeleteCategory(id: string): Promise<void> {
    return this.categoryQueryManager.delete(id);
  }
}
