
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

// Types pour nos tables
export interface Income {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'income';
  date: string;
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
  carriedOver?: number;
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
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS incomes (
          id TEXT PRIMARY KEY,
          title TEXT,
          budget REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          type TEXT,
          date TEXT
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
          type TEXT,
          carriedOver REAL DEFAULT 0
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

      // Ajout des données de test avec la date
      const currentDate = new Date().toISOString().split('T')[0];
      
      this.db.run(`
        INSERT OR IGNORE INTO incomes (id, title, budget, spent, type, date)
        VALUES 
        ('inc_1', 'Salaire', 2500.00, 0, 'income', '${currentDate}')
      `);

      // Budgets de test
      this.db.run(`
        INSERT OR IGNORE INTO budgets (id, title, budget, spent, type, carriedOver)
        VALUES 
        ('bud_1', 'Courses', 500.00, 0, 'budget', 0),
        ('bud_2', 'Transport', 200.00, 0, 'budget', 0),
        ('bud_3', 'Loisirs', 150.00, 0, 'budget', 0),
        ('bud_4', 'Restaurant', 300.00, 0, 'budget', 0),
        ('bud_5', 'Shopping', 250.00, 0, 'budget', 0)
      `);

      // Dépenses de test
      this.db.run(`
        INSERT OR IGNORE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date)
        VALUES 
        ('exp_1', 'Courses Carrefour', 350.00, 0, 'expense', 'bud_1', ?),
        ('exp_2', 'Courses Lidl', 250.00, 0, 'expense', 'bud_1', ?),
        ('exp_3', 'Restaurant italien', 150.00, 0, 'expense', 'bud_4', ?),
        ('exp_4', 'Vêtements', 100.00, 0, 'expense', 'bud_5', ?)
      `, [currentDate, currentDate, currentDate, currentDate]);

      this.initialized = true;
      console.log("Base de données initialisée avec les données de test");

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      throw err;
    }
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
      type: row[4] as 'income',
      date: row[5]
    })) || [];
  }

  async addIncome(income: Income) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO incomes (id, title, budget, spent, type, date) VALUES (?, ?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type, income.date]
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
      budget: Number(row[2]),
      spent: Number(row[3]),
      type: row[4] as 'budget',
      carriedOver: Number(row[5]) || 0
    })) || [];
  }

  async addBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    try {
      console.log("Ajout d'un nouveau budget:", budget);
      this.db.run(
        'INSERT INTO budgets (id, title, budget, spent, type, carriedOver) VALUES (?, ?, ?, ?, ?, ?)',
        [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0]
      );
      console.log("Budget ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    try {
      console.log("Mise à jour du budget:", budget);
      this.db.run(
        'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ? WHERE id = ?',
        [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, budget.id]
      );
      console.log("Budget mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du budget:", error);
      throw error;
    }
  }

  async deleteBudget(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM budgets WHERE id = ?', [id]);
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
    if (!this.initialized) await this.init();
    
    try {
      console.log("=== Début du chargement des catégories ===");
      const result = this.db.exec('SELECT * FROM categories');
      console.log("Résultat brut de la requête:", result);
      
      if (!result[0]?.values) {
        console.log("Aucune catégorie trouvée");
        return [];
      }

      const categories = result[0].values.map((row: any[]) => {
        const [id, name, budgetsStr, total, spent, description] = row;
        let budgets;
        try {
          budgets = budgetsStr && typeof budgetsStr === 'string' ? JSON.parse(budgetsStr) : [];
          console.log(`Budgets parsés pour la catégorie ${id}:`, budgets);
        } catch (e) {
          console.error(`Erreur de parsing des budgets pour la catégorie ${id}:`, e);
          budgets = [];
        }

        return {
          id,
          name,
          budgets: Array.isArray(budgets) ? budgets : [],
          total: Number(total) || 0,
          spent: Number(spent) || 0,
          description: description || ''
        };
      });

      console.log("Catégories chargées avec succès:", categories);
      return categories;
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      throw error;
    }
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
    
    try {
      console.log("Mise à jour de la catégorie:", category);
      this.db.run(
        'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
        [category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description, category.id]
      );
      console.log("Catégorie mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      throw error;
    }
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
