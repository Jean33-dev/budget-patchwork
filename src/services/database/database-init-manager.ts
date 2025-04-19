
import { Database } from "sql.js";
import { toast } from "@/components/ui/use-toast";
import { dashboardTableSchema } from "./queries/dashboard-queries";
import { SQLiteAdapter } from "./sqlite-adapter";
import { createSQLiteAdapter } from "./sqlite-adapter";

/**
 * Database initialization manager
 */
export class DatabaseInitManager {
  private adapter: SQLiteAdapter | null = null;
  private initialized = false;

  /**
   * Initialize the database adapter
   */
  async init(): Promise<boolean> {
    try {
      if (this.initialized && this.adapter) {
        console.log("DatabaseInitManager: Already initialized, reusing adapter");
        return true;
      }
      
      console.log("DatabaseInitManager: Creating SQLite adapter...");
      this.adapter = await createSQLiteAdapter();
      console.log("DatabaseInitManager: SQLite adapter created, initializing...");
      const success = await this.adapter.init();
      this.initialized = success;
      
      console.log("DatabaseInitManager: Adapter initialization " + (success ? "successful" : "failed"));
      return success;
    } catch (error) {
      console.error("Error initializing database adapter:", error);
      return false;
    }
  }

  /**
   * Get the database adapter
   */
  getAdapter(): SQLiteAdapter | null {
    return this.adapter;
  }

  /**
   * Ensure the database is initialized
   */
  async ensureInitialized(): Promise<boolean> {
    if (!this.initialized || !this.adapter) {
      return await this.init();
    }
    return true;
  }

  /**
   * Reset initialization attempts
   */
  resetInitializationAttempts(): void {
    console.log("DatabaseInitManager: Resetting initialization attempts");
    this.initialized = false;
    const { WebSQLiteAdapter } = require('./web-sqlite-adapter');
    WebSQLiteAdapter.resetInitializationAttempts();
  }

  /**
   * Initialize database tables
   */
  async initializeTables(db: Database): Promise<boolean> {
    try {
      console.log("Creating database tables...");
      
      // Create tables one by one with error handling
      try {
        console.log("Creating dashboards table...");
        db.exec(dashboardTableSchema);
        console.log("Dashboards table created successfully");
      } catch (err) {
        console.error("Error creating dashboards table:", err);
      }
      
      try {
        console.log("Creating budgets table...");
        db.exec(`CREATE TABLE IF NOT EXISTS budgets (
          id TEXT PRIMARY KEY,
          title TEXT,
          budget REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          type TEXT,
          carriedOver REAL DEFAULT 0,
          categoryId TEXT,
          dashboardId TEXT
        )`);
        console.log("Budgets table created successfully");
      } catch (err) {
        console.error("Error creating budgets table:", err);
      }
      
      try {
        console.log("Creating categories table...");
        db.exec(`CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT,
          budgets TEXT,
          total REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          description TEXT
        )`);
        console.log("Categories table created successfully");
      } catch (err) {
        console.error("Error creating categories table:", err);
      }
      
      try {
        console.log("Creating expenses table...");
        db.exec(`CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          title TEXT,
          budget REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          type TEXT,
          linkedBudgetId TEXT,
          date TEXT,
          isRecurring INTEGER DEFAULT 0,
          dashboardId TEXT
        )`);
        console.log("Expenses table created successfully");
      } catch (err) {
        console.error("Error creating expenses table:", err);
      }
      
      try {
        console.log("Creating incomes table...");
        db.exec(`CREATE TABLE IF NOT EXISTS incomes (
          id TEXT PRIMARY KEY,
          title TEXT,
          budget REAL DEFAULT 0,
          spent REAL DEFAULT 0,
          type TEXT,
          date TEXT,
          isRecurring INTEGER DEFAULT 0,
          dashboardId TEXT
        )`);
        console.log("Incomes table created successfully");
      } catch (err) {
        console.error("Error creating incomes table:", err);
      }
      
      // Insert default categories if none exist
      try {
        console.log("Checking for existing categories...");
        const result = db.exec("SELECT COUNT(*) as count FROM categories");
        let categoryCount = 0;
        
        if (result && result.length > 0 && result[0].values && result[0].values.length > 0) {
          categoryCount = result[0].values[0][0] as number;
        }
        
        console.log(`Found ${categoryCount} existing categories`);
        
        if (categoryCount === 0) {
          console.log("No categories found, inserting default categories...");
          
          // Insert default categories
          const defaultCategories = [
            {
              id: 'necessaire',
              name: 'Nécessaire',
              budgets: '[]',
              total: 0,
              spent: 0,
              description: 'Dépenses essentielles comme le logement, l\'alimentation, etc.'
            },
            {
              id: 'plaisir',
              name: 'Plaisir',
              budgets: '[]',
              total: 0,
              spent: 0,
              description: 'Loisirs, sorties, shopping, etc.'
            },
            {
              id: 'epargne',
              name: 'Épargne',
              budgets: '[]',
              total: 0,
              spent: 0,
              description: 'Économies et investissements'
            }
          ];
          
          for (const category of defaultCategories) {
            db.exec(`
              INSERT INTO categories (id, name, budgets, total, spent, description)
              VALUES ('${category.id}', '${category.name}', '${category.budgets}', 
                      ${category.total}, ${category.spent}, '${category.description}')
            `);
          }
          
          console.log("Default categories inserted successfully");
        }
      } catch (err) {
        console.error("Error inserting default categories:", err);
      }
      
      console.log("Database tables initialization completed");
      return true;
    } catch (error) {
      console.error("Error initializing database tables:", error);
      toast({
        variant: "destructive",
        title: "Error initializing database",
        description: "Unable to create database tables. Please refresh the page."
      });
      return false;
    }
  }
}
