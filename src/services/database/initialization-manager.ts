import { BaseDatabaseManager } from '../base-database-manager';
import { budgetTableQueries } from './queries/budget';
import { categoryTableQueries } from './queries/category';
import { expenseTableQueries } from './queries/expense';
import { incomeTableQueries } from './queries/income';
import { dashboardQueries } from './queries/dashboard';

export class InitializationDatabaseManager extends BaseDatabaseManager {
  private initializationAttempts = 0;
  private maxInitializationAttempts = 3;

  async init(): Promise<boolean> {
    if (this.initializationAttempts >= this.maxInitializationAttempts) {
      console.error("Max database initialization attempts reached.");
      return false;
    }

    this.initializationAttempts++;
    console.log(`Database initialization attempt ${this.initializationAttempts}...`);

    try {
      const db = await this.getDb();
      if (!db) {
        console.error("Database is null or undefined.");
        return false;
      }

      const success = await this.initializeDatabase();
      if (success) {
        this.initializationAttempts = 0; // Reset attempts on success
        this.setInitialized(true);
        console.log("Database initialized successfully.");
        return true;
      } else {
        console.error("Database initialization failed.");
        return false;
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      return false;
    }
  }

  async initializeDatabase(): Promise<boolean> {
    try {
      const db = await this.getDb();
      if (!db) {
        console.error("Database connection is not available.");
        return false;
      }
      
      // Create tables
      console.log("Creating database tables...");
      if (this.db) {
        // Create the tables for budgets, expenses, incomes, and categories
        budgetTableQueries.create(this.db);
        categoryTableQueries.create(this.db);
        expenseTableQueries.create(this.db);
        incomeTableQueries.create(this.db);
        
        // Create dashboard table
        dashboardQueries.create(this.db);
        
        console.log("All database tables created successfully");
        return true;
      }
      
      console.error("Database instance is null or undefined.");
      return false;
    } catch (error) {
      console.error("Error initializing database:", error);
      return false;
    }
  }

  resetInitializationAttempts(): void {
    this.initializationAttempts = 0;
  }

  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      const db = await this.getDb();
      if (!db) {
        console.error("Database connection is not available for migration.");
        return false;
      }

      console.log("Starting migration from local storage...");

      // Migrate budgets
      const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      budgets.forEach((budget: any) => {
        budgetTableQueries.add(db, budget);
      });
      localStorage.removeItem('budgets');
      console.log(`Migrated ${budgets.length} budgets.`);

      // Migrate expenses
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      expenses.forEach((expense: any) => {
        expenseTableQueries.add(db, expense);
      });
      localStorage.removeItem('expenses');
      console.log(`Migrated ${expenses.length} expenses.`);

      // Migrate incomes
      const incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
      incomes.forEach((income: any) => {
        incomeTableQueries.add(db, income);
      });
      localStorage.removeItem('incomes');
      console.log(`Migrated ${incomes.length} incomes.`);

      // Migrate categories
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      categories.forEach((category: any) => {
        categoryTableQueries.add(db, category);
      });
      localStorage.removeItem('categories');
      console.log(`Migrated ${categories.length} categories.`);

      console.log("Migration from local storage completed.");
      return true;
    } catch (error) {
      console.error("Error during migration from local storage:", error);
      return false;
    }
  }
}
