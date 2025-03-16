
import { BaseDatabaseManager } from './base-database-manager';
import { Budget } from './models/budget';
import { budgetQueries } from './queries/budget-queries';
import { toast } from "@/components/ui/use-toast";

export class BudgetManager extends BaseDatabaseManager {
  async getBudgets(): Promise<Budget[]> {
    try {
      console.log("Fetching budgets...");
      await this.ensureInitialized();
      
      if (!this.db) {
        console.error("Database is null after initialization");
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "The database could not be properly initialized."
        });
        return [];
      }
      
      // Initialize the budgets table if it doesn't exist
      try {
        this.db.exec(budgetQueries.createTable);
        console.log("Budget table initialized or verified");
      } catch (tableError) {
        console.error("Error creating/checking budget table:", tableError);
      }
      
      const budgets = budgetQueries.getAll(this.db);
      console.log("Budgets fetched successfully:", budgets.length);
      
      // If no budgets, add sample data
      if (budgets.length === 0) {
        try {
          console.log("Adding sample budget data");
          const currentDate = new Date().toISOString().split('T')[0];
          this.db.exec(budgetQueries.sampleData(currentDate));
          
          // Fetch again after adding sample data
          const refreshedBudgets = budgetQueries.getAll(this.db);
          console.log("Sample budgets added:", refreshedBudgets.length);
          return refreshedBudgets;
        } catch (sampleError) {
          console.error("Error adding sample budget data:", sampleError);
        }
      }
      
      return budgets;
    } catch (error) {
      console.error("Error retrieving budgets:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to retrieve budgets. Please refresh the page."
      });
      return [];
    }
  }

  async addBudget(budget: Budget) {
    try {
      console.log("Adding new budget:", budget);
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      budgetQueries.add(this.db, budget);
      console.log("Budget added successfully");
      
      toast({
        title: "Budget added",
        description: `The budget "${budget.title}" has been added successfully.`
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to add the budget. Please try again."
      });
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    try {
      console.log("Updating budget:", budget);
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      budgetQueries.update(this.db, budget);
      console.log("Budget updated successfully");
      
      toast({
        title: "Budget updated",
        description: `The budget "${budget.title}" has been updated successfully.`
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to update the budget. Please try again."
      });
      throw error;
    }
  }

  async deleteBudget(id: string) {
    try {
      console.log("Deleting budget:", id);
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      budgetQueries.delete(this.db, id);
      console.log("Budget deleted successfully");
      
      toast({
        title: "Budget deleted",
        description: "The budget has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to delete the budget. Please try again."
      });
      throw error;
    }
  }
}
