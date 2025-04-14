
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
        return true;
      }
      
      this.adapter = await createSQLiteAdapter();
      const success = await this.adapter.init();
      this.initialized = success;
      
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
    const { WebSQLiteAdapter } = require('./web-sqlite-adapter');
    WebSQLiteAdapter.resetInitializationAttempts();
  }

  /**
   * Initialize database tables
   */
  async initializeTables(db: Database): Promise<boolean> {
    try {
      console.log("Creating database tables...");
      
      // Create tables
      db.exec(dashboardTableSchema);
      
      // Create other tables if needed
      db.exec(`CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        carriedOver REAL DEFAULT 0
      )`);
      
      db.exec(`CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT,
        budgets TEXT,
        total REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        description TEXT
      )`);
      
      db.exec(`CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        linkedBudgetId TEXT,
        date TEXT,
        isRecurring INTEGER DEFAULT 0
      )`);
      
      db.exec(`CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        date TEXT,
        isRecurring INTEGER DEFAULT 0
      )`);
      
      console.log("Database tables created successfully!");
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
