
import { BaseDatabaseManager } from './base-database-manager';
import { incomeQueries } from './queries/income-queries';
import { expenseQueries } from './queries/expense-queries';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';
import { toast } from "@/components/ui/use-toast";

/**
 * Handles database initialization and migration
 */
export class DatabaseInitializer extends BaseDatabaseManager {
  /**
   * Initialize the database and create tables
   */
  async initialize(): Promise<boolean> {
    // Initialize the base class
    console.log("DatabaseInitializer: Starting initialization process");
    const success = await super.init();
    if (!success) {
      console.error("DatabaseInitializer: Failed to initialize base database manager");
      return false;
    }

    try {
      console.log("DatabaseInitializer: Creating database tables...");
      
      // Create tables
      this.db.run(incomeQueries.createTable);
      this.db.run(expenseQueries.createTable);
      this.db.run(budgetQueries.createTable);
      this.db.run(categoryQueries.createTable);

      // Add sample data if tables are empty
      await this.addSampleDataIfNeeded();

      console.log("DatabaseInitializer: Database successfully initialized");
      
      toast({
        title: "Database initialized",
        description: "The database has been successfully initialized."
      });

      return true;
    } catch (err) {
      console.error('DatabaseInitializer: Error initializing database:', err);
      toast({
        variant: "destructive",
        title: "Initialization Error",
        description: "Unable to initialize the database. Please refresh the page."
      });
      return false;
    }
  }

  /**
   * Add sample data to the database if tables are empty
   */
  private async addSampleDataIfNeeded(): Promise<void> {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Check if data already exists in the tables
      const budgetsCheck = this.db.exec("SELECT COUNT(*) FROM budgets");
      const budgetsCount = budgetsCheck[0]?.values[0][0] || 0;
      
      if (budgetsCount === 0) {
        console.log("DatabaseInitializer: No existing budgets, adding sample data...");
        
        // Insert sample budgets
        this.db.run(budgetQueries.sampleData(currentDate));
        
        // Insert sample expenses
        const stmt = this.db.prepare(budgetQueries.expenseSampleData(currentDate));
        stmt.bind([currentDate, currentDate, currentDate, currentDate]);
        stmt.step();
        stmt.free();
        
        console.log("DatabaseInitializer: Sample data successfully added");
      } else {
        console.log(`DatabaseInitializer: ${budgetsCount} budgets found, no need to add sample data`);
      }
    } catch (error) {
      console.error("DatabaseInitializer: Error checking or adding sample data:", error);
      // Continue initialization even if sample data fails
    }
  }

  /**
   * Migrate data from localStorage to the database
   */
  async migrateFromLocalStorage(): Promise<void> {
    try {
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      // Migrate incomes
      const storedIncomes = localStorage.getItem('app_incomes');
      if (storedIncomes) {
        const incomes = JSON.parse(storedIncomes);
        for (const income of incomes) {
          incomeQueries.add(this.db, income);
        }
      }

      // Migrate expenses
      const storedExpenses = localStorage.getItem('app_expenses');
      if (storedExpenses) {
        const expenses = JSON.parse(storedExpenses);
        for (const expense of expenses) {
          expenseQueries.add(this.db, expense);
        }
      }

      // Migrate budgets
      const storedBudgets = localStorage.getItem('app_budgets');
      if (storedBudgets) {
        const budgets = JSON.parse(storedBudgets);
        for (const budget of budgets) {
          budgetQueries.add(this.db, budget);
        }
      }

      // Migrate categories
      const storedCategories = localStorage.getItem('app_categories');
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        for (const category of categories) {
          categoryQueries.add(this.db, category);
        }
      }

      // Remove old data from localStorage
      localStorage.removeItem('app_incomes');
      localStorage.removeItem('app_expenses');
      localStorage.removeItem('app_budgets');
      localStorage.removeItem('app_categories');
      
      toast({
        title: "Migration complete",
        description: "Data has been successfully migrated from localStorage."
      });
    } catch (error) {
      console.error("Error migrating from localStorage:", error);
      toast({
        variant: "destructive",
        title: "Migration Error",
        description: "Unable to migrate data from localStorage."
      });
    }
  }
}
