
import { BaseDatabaseManager } from './base-database-manager';
import { incomeQueries } from './queries/income-queries';
import { expenseQueries } from './queries/expense-queries';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';

export class QueryManager extends BaseDatabaseManager {
  async executeGetIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    if (!this.db) return [];
    return incomeQueries.getAll(this.db);
  }

  async executeAddIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) return;
    incomeQueries.add(this.db, income);
  }

  async executeUpdateIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) return;
    incomeQueries.update(this.db, income);
  }

  async executeDeleteIncome(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.db || !id) return;
    incomeQueries.delete(this.db, id);
  }

  async executeGetExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    if (!this.db) return [];
    return expenseQueries.getAll(this.db);
  }

  async executeAddExpense(expense: Expense): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) return;
    expenseQueries.add(this.db, expense);
  }

  async executeDeleteExpense(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.db || !id) return;
    expenseQueries.delete(this.db, id);
  }

  async executeGetBudgets(): Promise<Budget[]> {
    await this.ensureInitialized();
    if (!this.db) return [];
    return budgetQueries.getAll(this.db);
  }

  async executeAddBudget(budget: Budget): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) return;
    budgetQueries.add(this.db, budget);
  }

  async executeUpdateBudget(budget: Budget): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) return;
    budgetQueries.update(this.db, budget);
  }

  async executeDeleteBudget(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.db || !id) return;
    budgetQueries.delete(this.db, id);
  }

  async executeGetCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    if (!this.db) return [];
    return categoryQueries.getAll(this.db);
  }

  async executeAddCategory(category: Category): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) return;
    categoryQueries.add(this.db, category);
  }

  async executeUpdateCategory(category: Category): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) return;
    categoryQueries.update(this.db, category);
  }

  async executeDeleteCategory(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.db || !id) return;
    categoryQueries.delete(this.db, id);
  }
}
