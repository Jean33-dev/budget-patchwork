
import { Database } from "sql.js";
import { toast } from "@/components/ui/use-toast";
import { dashboardTableSchema } from "./queries/dashboard-queries";

/**
 * Database initialization manager
 */
export class DatabaseInitManager {
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
