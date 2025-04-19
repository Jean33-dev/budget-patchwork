
import { SQLiteAdapter } from './sqlite-adapter';
import { Dashboard } from './models/dashboard';
import { Budget } from './models/budget';
import { Income } from './models/income';
import { Expense } from './models/expense';

export class InitializationManager {
  private adapter: SQLiteAdapter;

  constructor(adapter: SQLiteAdapter) {
    this.adapter = adapter;
  }

  /**
   * Ensure the database has the necessary tables
   */
  async createTables(): Promise<void> {
    console.log("Creating database tables...");
    
    // Create dashboard table
    await this.adapter.execute(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        lastAccessed TEXT NOT NULL
      )
    `);
    
    // Create budget table
    await this.adapter.execute(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        budget REAL NOT NULL DEFAULT 0,
        spent REAL NOT NULL DEFAULT 0,
        type TEXT NOT NULL DEFAULT 'budget',
        categoryId TEXT,
        carriedOver REAL DEFAULT 0,
        dashboardId TEXT
      )
    `);
    
    // Create expense table
    await this.adapter.execute(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        budget REAL NOT NULL DEFAULT 0,
        spent REAL NOT NULL DEFAULT 0,
        type TEXT NOT NULL DEFAULT 'expense',
        linkedBudgetId TEXT,
        date TEXT,
        isRecurring INTEGER DEFAULT 0,
        dashboardId TEXT
      )
    `);
    
    // Create income table
    await this.adapter.execute(`
      CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        budget REAL NOT NULL DEFAULT 0,
        spent REAL NOT NULL DEFAULT 0,
        type TEXT NOT NULL DEFAULT 'income',
        date TEXT,
        isRecurring INTEGER DEFAULT 0,
        dashboardId TEXT
      )
    `);
    
    // Create category table
    await this.adapter.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        budgets TEXT DEFAULT '[]',
        total REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        description TEXT,
        dashboardId TEXT
      )
    `);
    
    console.log("Database tables created successfully");
  }

  /**
   * Add default dashboard if none exists
   */
  async addDefaultDashboard(): Promise<string> {
    console.log("Checking if default dashboard exists...");
    
    const dashboards = await this.adapter.query("SELECT * FROM dashboards WHERE id = 'default'");
    
    if (dashboards.length === 0) {
      console.log("No default dashboard found, creating one...");
      
      const defaultDashboard: Dashboard = {
        id: 'default',
        title: 'Budget Personnel',
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      
      await this.adapter.execute(
        "INSERT INTO dashboards (id, title, createdAt, lastAccessed) VALUES (?, ?, ?, ?)",
        [defaultDashboard.id, defaultDashboard.title, defaultDashboard.createdAt, defaultDashboard.lastAccessed]
      );
      
      console.log("Default dashboard created successfully");
      return defaultDashboard.id;
    }
    
    console.log("Default dashboard already exists");
    return 'default';
  }

  /**
   * Add sample budgets if the budgets table is empty
   */
  async addSampleBudgets(dashboardId: string): Promise<void> {
    console.log("Checking if sample budgets need to be added...");
    
    const budgets = await this.adapter.query("SELECT * FROM budgets");
    
    if (budgets.length === 0) {
      console.log("No budgets found, adding sample budgets...");
      
      const sampleBudgets: Budget[] = [
        {
          id: 'budget_logement',
          title: 'Logement',
          budget: 800,
          spent: 0,
          type: 'budget',
          categoryId: 'necessaire',
          dashboardId
        },
        {
          id: 'budget_alimentation',
          title: 'Alimentation',
          budget: 400,
          spent: 0,
          type: 'budget',
          categoryId: 'necessaire',
          dashboardId
        },
        {
          id: 'budget_loisirs',
          title: 'Loisirs',
          budget: 200,
          spent: 0,
          type: 'budget',
          categoryId: 'plaisir',
          dashboardId
        },
        {
          id: 'budget_epargne',
          title: 'Épargne',
          budget: 300,
          spent: 0,
          type: 'budget',
          categoryId: 'epargne',
          dashboardId
        }
      ];
      
      for (const budget of sampleBudgets) {
        await this.adapter.execute(
          "INSERT INTO budgets (id, title, budget, spent, type, categoryId, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.categoryId, budget.dashboardId]
        );
      }
      
      console.log("Sample budgets added successfully");
    } else {
      console.log("Budgets already exist, skipping sample data");
    }
  }

  /**
   * Add sample incomes if the incomes table is empty
   */
  async addSampleIncomes(dashboardId: string): Promise<void> {
    console.log("Checking if sample incomes need to be added...");
    
    const incomes = await this.adapter.query("SELECT * FROM incomes");
    
    if (incomes.length === 0) {
      console.log("No incomes found, adding sample incomes...");
      
      const sampleIncomes: Income[] = [
        {
          id: 'income_salaire',
          title: 'Salaire',
          budget: 2000,
          spent: 2000,
          type: 'income',
          date: new Date().toISOString().split('T')[0],
          dashboardId
        },
        {
          id: 'income_autres',
          title: 'Autres revenus',
          budget: 200,
          spent: 200,
          type: 'income',
          date: new Date().toISOString().split('T')[0],
          dashboardId
        }
      ];
      
      for (const income of sampleIncomes) {
        await this.adapter.execute(
          "INSERT INTO incomes (id, title, budget, spent, type, date, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [income.id, income.title, income.budget, income.spent, income.type, income.date, income.dashboardId]
        );
      }
      
      console.log("Sample incomes added successfully");
    } else {
      console.log("Incomes already exist, skipping sample data");
    }
  }

  /**
   * Add sample expenses if the expenses table is empty
   */
  async addSampleExpenses(dashboardId: string): Promise<void> {
    console.log("Checking if sample expenses need to be added...");
    
    const expenses = await this.adapter.query("SELECT * FROM expenses");
    
    if (expenses.length === 0) {
      console.log("No expenses found, adding sample expenses...");
      
      const sampleExpenses: Expense[] = [
        {
          id: 'expense_loyer',
          title: 'Loyer',
          budget: 650,
          spent: 650,
          type: 'expense',
          linkedBudgetId: 'budget_logement',
          date: new Date().toISOString().split('T')[0],
          dashboardId
        },
        {
          id: 'expense_courses',
          title: 'Courses',
          budget: 120,
          spent: 120,
          type: 'expense',
          linkedBudgetId: 'budget_alimentation',
          date: new Date().toISOString().split('T')[0],
          dashboardId
        },
        {
          id: 'expense_cinema',
          title: 'Cinéma',
          budget: 30,
          spent: 30,
          type: 'expense',
          linkedBudgetId: 'budget_loisirs',
          date: new Date().toISOString().split('T')[0],
          dashboardId
        }
      ];
      
      for (const expense of sampleExpenses) {
        await this.adapter.execute(
          "INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date, expense.dashboardId]
        );
      }
      
      console.log("Sample expenses added successfully");
    } else {
      console.log("Expenses already exist, skipping sample data");
    }
  }

  /**
   * Check and add sample data if needed
   */
  async checkAndAddSampleData(): Promise<void> {
    try {
      // Add default dashboard
      const dashboardId = await this.addDefaultDashboard();
      
      // Create default categories if they don't exist
      await this.addDefaultCategories(dashboardId);
      
      // Add sample data if needed
      await this.addSampleBudgets(dashboardId);
      await this.addSampleIncomes(dashboardId);
      await this.addSampleExpenses(dashboardId);
      
      console.log("Sample data setup complete");
    } catch (error) {
      console.error("Error adding sample data:", error);
      throw error;
    }
  }

  /**
   * Add default categories if they don't exist
   */
  async addDefaultCategories(dashboardId: string): Promise<void> {
    console.log("Checking if default categories exist...");
    
    const categories = await this.adapter.query("SELECT * FROM categories");
    
    if (categories.length === 0) {
      console.log("No categories found, adding default categories...");
      
      const defaultCategories = [
        {
          id: 'necessaire',
          name: 'Nécessaire',
          budgets: '[]',
          total: 0,
          spent: 0,
          description: 'Dépenses essentielles comme le logement, l\'alimentation, etc.',
          dashboardId
        },
        {
          id: 'plaisir',
          name: 'Plaisir',
          budgets: '[]',
          total: 0,
          spent: 0,
          description: 'Loisirs, sorties, shopping, etc.',
          dashboardId
        },
        {
          id: 'epargne',
          name: 'Épargne',
          budgets: '[]',
          total: 0,
          spent: 0,
          description: 'Économies et investissements',
          dashboardId
        }
      ];
      
      for (const category of defaultCategories) {
        await this.adapter.execute(
          "INSERT INTO categories (id, name, budgets, total, spent, description, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [category.id, category.name, category.budgets, category.total, category.spent, category.description, category.dashboardId]
        );
      }
      
      console.log("Default categories added successfully");
    } else {
      console.log("Categories already exist, skipping default categories");
    }
  }
}
