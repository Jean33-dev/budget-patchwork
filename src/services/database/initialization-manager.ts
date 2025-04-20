
import { DatabaseManagerCore } from './database-manager-core';
import { budgetTableQueries } from './queries/budget/table';
import { categoryTableQueries } from './queries/category/table';
import { expenseQueries } from './queries/expense';
import { incomeQueries } from './queries/income-queries';
import { dashboardTableQueries } from './queries/dashboard/table';

export class InitializationManager {
  private db: any;
  
  constructor(adapter: any) {
    this.db = adapter.db;
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
      budgetTableQueries.create(this.db);
      categoryTableQueries.create(this.db);
      expenseQueries.create(this.db);
      incomeQueries.createTable(this.db);
      
      // Create dashboard table
      dashboardTableQueries.create(this.db);
      
      console.log("All database tables created successfully");
      return true;
    } catch (error) {
      console.error("Error initializing database:", error);
      return false;
    }
  }
  
  async checkAndAddSampleData(): Promise<boolean> {
    try {
      // Sample implementation for adding sample data if needed
      console.log("Checking if sample data needs to be added...");
      return true;
    } catch (error) {
      console.error("Error adding sample data:", error);
      return false;
    }
  }
}
