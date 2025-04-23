
import { DatabaseManagerCore } from './database-manager-core';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';
import { expenseQueries } from './queries/expense';
import { incomeQueries } from './queries/income-queries';
import { dashboardQueries } from './queries/dashboard';

export class InitializationManager {
  private db: any;
  
  constructor(adapter: any) {
    this.db = adapter.db;
  }

  async clearAllData(): Promise<boolean> {
    try {
      if (!this.db) {
        console.error("Database connection is not available.");
        return false;
      }

      // Delete all data from each table
      console.log("Clearing all data from database...");
      this.db.exec('DELETE FROM budgets');
      this.db.exec('DELETE FROM categories');
      this.db.exec('DELETE FROM expenses');
      this.db.exec('DELETE FROM incomes');
      this.db.exec('DELETE FROM dashboards');

      console.log("All data cleared successfully");
      return true;
    } catch (error) {
      console.error("Error clearing database data:", error);
      return false;
    }
  }
  
  async createTables(): Promise<boolean> {
    try {
      if (!this.db) {
        console.error("Database connection is not available.");
        return false;
      }
      
      // Create tables
      console.log("Creating database tables...");
      
      // Create the tables for budgets, expenses, incomes, and categories
      this.db.exec(budgetQueries.createTable);
      this.db.exec(categoryQueries.createTable);
      this.db.exec(expenseQueries.createTable);
      this.db.exec(incomeQueries.createTable);
      
      // Create dashboard table
      this.db.exec(dashboardQueries.createTable);
      
      console.log("All database tables created successfully");
      return true;
    } catch (error) {
      console.error("Error initializing database:", error);
      return false;
    }
  }
  
  async checkAndAddSampleData(): Promise<boolean> {
    // Remove sample data initialization to start with empty database
    return true;
  }
}
