
import initSqlJs from 'sql.js';
import { SCHEMA_DEFINITIONS } from './database/schema';
import { IncomeOperations } from './database/income-operations';
import { ExpenseOperations } from './database/expense-operations';
import { BudgetOperations } from './database/budget-operations';
import { CategoryOperations } from './database/category-operations';
import type { Income, Expense, Budget, Category } from '@/types/database-types';

class Database {
  private db: any = null;
  private initialized = false;
  private incomeOps: IncomeOperations | null = null;
  private expenseOps: ExpenseOperations | null = null;
  private budgetOps: BudgetOperations | null = null;
  private categoryOps: CategoryOperations | null = null;

  async init() {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      this.db = new SQL.Database();
      
      // Création des tables
      Object.values(SCHEMA_DEFINITIONS).forEach(schema => {
        this.db.run(schema);
      });

      // Initialisation des opérations
      this.incomeOps = new IncomeOperations(this.db);
      this.expenseOps = new ExpenseOperations(this.db);
      this.budgetOps = new BudgetOperations(this.db);
      this.categoryOps = new CategoryOperations(this.db);

      this.initialized = true;
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      this.initialized = false;
      throw err;
    }
  }

  private ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call init() first.');
    }
  }

  // Méthodes pour les revenus
  async getIncomes(): Promise<Income[]> {
    this.ensureInitialized();
    return this.incomeOps!.getIncomes();
  }

  async addIncome(income: Income) {
    this.ensureInitialized();
    return this.incomeOps!.addIncome(income);
  }

  async updateIncome(income: Income) {
    this.ensureInitialized();
    return this.incomeOps!.updateIncome(income);
  }

  async deleteIncome(id: string) {
    this.ensureInitialized();
    return this.incomeOps!.deleteIncome(id);
  }

  // Méthodes pour les dépenses
  async getExpenses(): Promise<Expense[]> {
    this.ensureInitialized();
    return this.expenseOps!.getExpenses();
  }

  async addExpense(expense: Expense) {
    this.ensureInitialized();
    return this.expenseOps!.addExpense(expense);
  }

  async updateExpense(expense: Expense) {
    this.ensureInitialized();
    return this.expenseOps!.updateExpense(expense);
  }

  async deleteExpense(id: string) {
    this.ensureInitialized();
    return this.expenseOps!.deleteExpense(id);
  }

  // Méthodes pour les budgets
  async getBudgets(): Promise<Budget[]> {
    this.ensureInitialized();
    return this.budgetOps!.getBudgets();
  }

  async addBudget(budget: Budget) {
    this.ensureInitialized();
    return this.budgetOps!.addBudget(budget);
  }

  async updateBudget(budget: Budget) {
    this.ensureInitialized();
    return this.budgetOps!.updateBudget(budget);
  }

  async deleteBudget(id: string) {
    this.ensureInitialized();
    return this.budgetOps!.deleteBudget(id);
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
    this.ensureInitialized();
    return this.categoryOps!.getCategories();
  }

  async addCategory(category: Category) {
    this.ensureInitialized();
    return this.categoryOps!.addCategory(category);
  }

  async updateCategory(category: Category) {
    this.ensureInitialized();
    return this.categoryOps!.updateCategory(category);
  }

  async deleteCategory(id: string) {
    this.ensureInitialized();
    return this.categoryOps!.deleteCategory(id);
  }
}

export const db = new Database();
export type { Income, Expense, Budget, Category };
