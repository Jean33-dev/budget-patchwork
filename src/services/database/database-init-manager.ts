
import { BaseDatabaseManager } from './base-database-manager';
import { incomeQueries } from './queries/income-queries';
import { expenseQueries } from './queries/expense-queries';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';
import { toast } from "@/components/ui/use-toast";

export class DatabaseInitManager extends BaseDatabaseManager {
  async init(): Promise<boolean> {
    // Always try to initialize if db is null, even if initialized flag is true
    if (this.initialized && this.db) return true;

    try {
      // Initialize the base class
      const success = await super.init();
      if (!success) {
        console.error("Failed to initialize base database manager");
        return false;
      }
      
      console.log("Creating database tables...");
      
      // Create tables
      this.db.run(incomeQueries.createTable);
      this.db.run(expenseQueries.createTable);
      this.db.run(budgetQueries.createTable);
      this.db.run(categoryQueries.createTable);

      // Add test data
      const currentDate = new Date().toISOString().split('T')[0];
      
      try {
        // Check if data already exists in tables
        const budgetsCheckResult = this.db.exec("SELECT COUNT(*) FROM budgets");
        const budgetsCount = budgetsCheckResult[0]?.values[0][0] || 0;
        
        console.log(`Existing budgets count: ${budgetsCount}`);
        
        if (budgetsCount === 0) {
          console.log("No existing budgets, adding sample data...");
          
          // Add budgets
          const budgetInsertQuery = budgetQueries.sampleData(currentDate);
          this.db.run(budgetInsertQuery);
          console.log("Budget sample data added");
          
          // Add expenses linked to budgets
          const expenseInsertQuery = budgetQueries.expenseSampleData(currentDate);
          // Prepare the statement with the current date for all parameters
          const stmt = this.db.prepare(expenseInsertQuery);
          stmt.run([currentDate, currentDate, currentDate, currentDate]);
          stmt.free();
          console.log("Expense sample data added");
          
          console.log("Sample data added successfully");
        } else {
          console.log(`${budgetsCount} budgets found, no need to add sample data`);
        }
      } catch (checkError) {
        console.error("Error checking or adding sample data:", checkError);
      }

      console.log("Database initialized successfully");
      
      toast({
        title: "Base de données initialisée",
        description: "La base de données a été initialisée avec succès."
      });
      
      this.initialized = true;
      return true;

    } catch (err) {
      console.error('Error initializing database:', err);
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser la base de données. Veuillez rafraîchir la page."
      });
      this.initialized = false;
      this.db = null;
      return false;
    }
  }

  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      // Ensure database is initialized and capture the result
      const initialized = await this.ensureInitialized();
      
      // Explicitly check the boolean result
      if (!initialized) {
        console.error("Database initialization failed during migration");
        return false;
      }
      
      if (!this.db) {
        console.error("Database instance is null after initialization");
        return false;
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
        title: "Migration terminée",
        description: "Données migrées avec succès depuis localStorage."
      });
      
      return true;
    } catch (error) {
      console.error("Error migrating from localStorage:", error);
      toast({
        variant: "destructive",
        title: "Erreur de migration",
        description: "Impossible de migrer les données depuis localStorage."
      });
      return false;
    }
  }
}
