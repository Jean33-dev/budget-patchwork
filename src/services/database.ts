
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

// Types pour nos tables
export interface Income {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'income';
}

export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId?: string;
  date: string;
}

export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'budget';
}

export interface Category {
  id: string;
  name: string;
  budgets: string[];
  total: number;
  spent: number;
  description: string;
}

class Database {
  private db: any = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      this.db = new SQL.Database();
      
      // Tables SQL avec des valeurs par défaut pour les colonnes numériques
      this.db.run(`
        CREATE TABLE IF NOT EXISTS incomes (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          budget REAL NOT NULL DEFAULT 0,
          spent REAL NOT NULL DEFAULT 0,
          type TEXT NOT NULL DEFAULT 'income'
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          budget REAL NOT NULL DEFAULT 0,
          spent REAL NOT NULL DEFAULT 0,
          type TEXT NOT NULL DEFAULT 'expense',
          linkedBudgetId TEXT,
          date TEXT NOT NULL
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS budgets (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          budget REAL NOT NULL DEFAULT 0,
          spent REAL NOT NULL DEFAULT 0,
          type TEXT NOT NULL DEFAULT 'budget'
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          budgets TEXT NOT NULL DEFAULT '[]',
          total REAL NOT NULL DEFAULT 0,
          spent REAL NOT NULL DEFAULT 0,
          description TEXT
        )
      `);

      this.initialized = true;
      
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      this.initialized = false;
      throw err;
    }
  }

  // Méthodes pour les revenus
  async getIncomes(): Promise<Income[]> {
    if (!this.initialized) await this.init();
    
    const result = this.db.exec('SELECT * FROM incomes');
    return result[0]?.values?.map((row: any[]) => ({
      id: String(row[0]),
      title: String(row[1]),
      budget: Number(row[2]),
      spent: Number(row[3]),
      type: row[4] as 'income'
    })) || [];
  }

  async addIncome(income: Income) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO incomes (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
      [income.id, income.title, Number(income.budget), Number(income.spent), income.type]
    );
  }

  async updateIncome(income: Income) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, Number(income.budget), Number(income.spent), income.id]
    );
  }

  async deleteIncome(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM incomes WHERE id = ?', [id]);
  }

  // Méthodes pour les dépenses
  async getExpenses(): Promise<Expense[]> {
    if (!this.initialized) await this.init();
    
    const result = this.db.exec('SELECT * FROM expenses');
    return result[0]?.values?.map((row: any[]) => ({
      id: String(row[0]),
      title: String(row[1]),
      budget: Number(row[2]),
      spent: Number(row[3]),
      type: row[4] as 'expense',
      linkedBudgetId: row[5] ? String(row[5]) : undefined,
      date: String(row[6])
    })) || [];
  }

  async addExpense(expense: Expense) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        expense.id,
        expense.title,
        Number(expense.budget),
        Number(expense.spent),
        expense.type,
        expense.linkedBudgetId || null,
        expense.date
      ]
    );
  }

  async updateExpense(expense: Expense) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?',
      [
        expense.title,
        Number(expense.budget),
        Number(expense.spent),
        expense.linkedBudgetId || null,
        expense.date,
        expense.id
      ]
    );
  }

  async deleteExpense(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  // Méthodes pour les budgets
  async getBudgets(): Promise<Budget[]> {
    if (!this.initialized) await this.init();
    
    const result = this.db.exec('SELECT * FROM budgets');
    return result[0]?.values?.map((row: any[]) => ({
      id: String(row[0]),
      title: String(row[1]),
      budget: Number(row[2]),
      spent: Number(row[3]),
      type: row[4] as 'budget'
    })) || [];
  }

  async addBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    try {
      this.db.run(
        'INSERT INTO budgets (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
        [
          String(budget.id),
          String(budget.title),
          Number(budget.budget),
          Number(budget.spent),
          String(budget.type)
        ]
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [
        String(budget.title),
        Number(budget.budget),
        Number(budget.spent),
        String(budget.id)
      ]
    );
  }

  async deleteBudget(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM budgets WHERE id = ?', [String(id)]);
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
    if (!this.initialized) await this.init();
    
    const result = this.db.exec('SELECT * FROM categories');
    return result[0]?.values?.map((row: any[]) => {
      let budgets;
      try {
        budgets = JSON.parse(row[2]);
      } catch {
        budgets = [];
      }
      
      return {
        id: String(row[0]),
        name: String(row[1]),
        budgets,
        total: Number(row[3]),
        spent: Number(row[4]),
        description: row[5] ? String(row[5]) : ''
      };
    }) || [];
  }

  async addCategory(category: Category) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [
        String(category.id),
        String(category.name),
        JSON.stringify(category.budgets),
        Number(category.total),
        Number(category.spent),
        category.description
      ]
    );
  }

  async updateCategory(category: Category) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [
        String(category.name),
        JSON.stringify(category.budgets),
        Number(category.total),
        Number(category.spent),
        category.description,
        String(category.id)
      ]
    );
  }

  async deleteCategory(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM categories WHERE id = ?', [String(id)]);
  }
}

export const db = new Database();
