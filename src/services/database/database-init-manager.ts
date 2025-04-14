
import { Database } from "sql.js";
import { toast } from "@/components/ui/use-toast";
import { budgetTableSchema } from "./queries/budget-queries";
import { categoryTableSchema } from "./queries/category-queries";
import { expenseTableSchema } from "./queries/expense-queries";
import { incomeTableSchema } from "./queries/income-queries";
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
      db.exec(budgetTableSchema);
      db.exec(categoryTableSchema);
      db.exec(expenseTableSchema);
      db.exec(incomeTableSchema);
      
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
