
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
          title TEXT,
          budget REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          type TEXT
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          title TEXT,
          budget REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          type TEXT,
          linkedBudgetId TEXT,
          date TEXT
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS budgets (
          id TEXT PRIMARY KEY,
          title TEXT,
          budget REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          type TEXT
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT,
          budgets TEXT,
          total REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          description TEXT
        )
      `);

      this.initialized = true;
      await this.migrateFromLocalStorage();

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: "Impossible d'initialiser la base de données SQLite"
      });
    }
  }

  private async migrateFromLocalStorage() {
    // Migrer les revenus
    const storedIncomes = localStorage.getItem('app_incomes');
    if (storedIncomes) {
      const incomes = JSON.parse(storedIncomes);
      for (const income of incomes) {
        await this.addIncome(income);
      }
    }

    // Migrer les dépenses
    const storedExpenses = localStorage.getItem('app_expenses');
    if (storedExpenses) {
      const expenses = JSON.parse(storedExpenses);
      for (const expense of expenses) {
        await this.addExpense(expense);
      }
    }

    // Migrer les budgets
    const storedBudgets = localStorage.getItem('app_budgets');
    if (storedBudgets) {
      const budgets = JSON.parse(storedBudgets);
      for (const budget of budgets) {
        await this.addBudget(budget);
      }
    }

    // Migrer les catégories
    const storedCategories = localStorage.getItem('app_categories');
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      for (const category of categories) {
        await this.addCategory(category);
      }
    }

    // Supprimer les anciennes données du localStorage
    localStorage.removeItem('app_incomes');
    localStorage.removeItem('app_expenses');
    localStorage.removeItem('app_budgets');
    localStorage.removeItem('app_categories');
  }

  // Méthodes pour les revenus
  async getIncomes(): Promise<Income[]> {
    if (!this.initialized) await this.init();
    
    const result = this.db.exec('SELECT * FROM incomes');
    return result[0]?.values?.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      budget: row[2],
      spent: row[3],
      type: row[4] as 'income'
    })) || [];
  }

  async addIncome(income: Income) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO incomes (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type]
    );
  }

  async updateIncome(income: Income) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.id]
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
      id: row[0],
      title: row[1],
      budget: row[2],
      spent: row[3],
      type: row[4] as 'expense',
      linkedBudgetId: row[5],
      date: row[6]
    })) || [];
  }

  async addExpense(expense: Expense) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
    );
  }

  async updateExpense(expense: Expense) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.id]
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
      id: row[0],
      title: row[1],
      budget: row[2],
      spent: row[3],
      type: row[4] as 'budget'
    })) || [];
  }

  async addBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO budgets (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type]
    );
  }

  async updateBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.id]
    );
  }

  async deleteBudget(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM budgets WHERE id = ?', [id]);
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
    if (!this.initialized) await this.init();
    
    const result = this.db.exec('SELECT * FROM categories');
    return result[0]?.values?.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      budgets: JSON.parse(row[2]),
      total: row[3],
      spent: row[4],
      description: row[5]
    })) || [];
  }

  async addCategory(category: Category) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description]
    );
  }

  async updateCategory(category: Category) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description, category.id]
    );
  }

  async deleteCategory(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM categories WHERE id = ?', [id]);
  }

  // Sauvegarder la base de données
  exportData() {
    return this.db.export();
  }
}

export const db = new Database();
