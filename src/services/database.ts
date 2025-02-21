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
      
      // Créer les tables
      this.db.run("CREATE TABLE IF NOT EXISTS incomes (id TEXT PRIMARY KEY, title TEXT, budget REAL, spent REAL, type TEXT)");
      this.db.run("CREATE TABLE IF NOT EXISTS expenses (id TEXT PRIMARY KEY, title TEXT, budget REAL, spent REAL, type TEXT, linkedBudgetId TEXT, date TEXT)");
      this.db.run("CREATE TABLE IF NOT EXISTS budgets (id TEXT PRIMARY KEY, title TEXT, budget REAL, spent REAL, type TEXT)");
      this.db.run("CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, budgets TEXT, total REAL, spent REAL, description TEXT)");

      this.initialized = true;

      // Charger les données existantes depuis le localStorage
      this.migrateFromLocalStorage();

    } catch (err) {
      console.error('Erreur lors de l'initialisation de la base de données:', err);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: "Impossible d'initialiser la base de données SQLite"
      });
    }
  }

  private migrateFromLocalStorage() {
    // Migrer les revenus
    const storedIncomes = localStorage.getItem('app_incomes');
    if (storedIncomes) {
      const incomes = JSON.parse(storedIncomes);
      incomes.forEach((income: Income) => {
        this.db.run(
          'INSERT OR REPLACE INTO incomes (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
          [income.id, income.title, income.budget, income.spent, income.type]
        );
      });
    }

    // Migrer les dépenses
    const storedExpenses = localStorage.getItem('app_expenses');
    if (storedExpenses) {
      const expenses = JSON.parse(storedExpenses);
      expenses.forEach((expense: Expense) => {
        this.db.run(
          'INSERT OR REPLACE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
        );
      });
    }

    // Migrer les budgets
    const storedBudgets = localStorage.getItem('app_budgets');
    if (storedBudgets) {
      const budgets = JSON.parse(storedBudgets);
      budgets.forEach((budget: Budget) => {
        this.db.run(
          'INSERT OR REPLACE INTO budgets (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
          [budget.id, budget.title, budget.budget, budget.spent, budget.type]
        );
      });
    }

    // Migrer les catégories
    const storedCategories = localStorage.getItem('app_categories');
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      categories.forEach((category: Category) => {
        this.db.run(
          'INSERT OR REPLACE INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
          [category.id, category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description]
        );
      });
    }

    // Supprimer les anciennes données du localStorage
    localStorage.removeItem('app_incomes');
    localStorage.removeItem('app_expenses');
    localStorage.removeItem('app_budgets');
    localStorage.removeItem('app_categories');
  }

  // Méthodes pour les revenus
  async getIncomes(): Promise<Income[]> {
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
    this.db.run(
      'INSERT INTO incomes (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type]
    );
  }

  async updateIncome(income: Income) {
    this.db.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.id]
    );
  }

  async deleteIncome(id: string) {
    this.db.run('DELETE FROM incomes WHERE id = ?', [id]);
  }

  // Méthodes pour les dépenses
  async getExpenses(): Promise<Expense[]> {
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
    this.db.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
    );
  }

  async updateExpense(expense: Expense) {
    this.db.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.id]
    );
  }

  async deleteExpense(id: string) {
    this.db.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  // Méthodes pour les budgets
  async getBudgets(): Promise<Budget[]> {
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
    this.db.run(
      'INSERT INTO budgets (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type]
    );
  }

  async updateBudget(budget: Budget) {
    this.db.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.id]
    );
  }

  async deleteBudget(id: string) {
    this.db.run('DELETE FROM budgets WHERE id = ?', [id]);
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
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
    this.db.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description]
    );
  }

  async updateCategory(category: Category) {
    this.db.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description, category.id]
    );
  }

  async deleteCategory(id: string) {
    this.db.run('DELETE FROM categories WHERE id = ?', [id]);
  }

  // Sauvegarder la base de données
  exportData() {
    return this.db.export();
  }
}

export const db = new Database();
