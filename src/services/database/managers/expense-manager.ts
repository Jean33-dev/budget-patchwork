
import { toast } from "@/components/ui/use-toast";
import { Expense } from '../models/expense';
import { BaseDatabaseManager } from '../base-database-manager';
import { IExpenseManager } from '../interfaces/IExpenseManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling expense-related database operations
 */
export class ExpenseManager extends BaseDatabaseManager implements IExpenseManager {
  /**
   * Get all expenses from the database
   */
  async getExpenses(): Promise<Expense[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in ExpenseManager.getExpenses");
        return [];
      }
      
      if (!this.queryManager) {
        console.error("Query manager is null in ExpenseManager.getExpenses");
        return [];
      }
      
      return await this.queryManager.executeGetExpenses();
    } catch (error) {
      console.error("Error in ExpenseManager.getExpenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur de récupération",
        description: "Impossible de récupérer les dépenses"
      });
      return [];
    }
  }

  /**
   * Add a new expense to the database
   */
  async addExpense(expense: Expense): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Database not initialized in ExpenseManager.addExpense");
      }
      
      if (!this.queryManager) {
        throw new Error("Query manager is null in ExpenseManager.addExpense");
      }
      
      await this.queryManager.executeAddExpense(expense);
    } catch (error) {
      console.error("Error in ExpenseManager.addExpense:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'ajout",
        description: "Impossible d'ajouter la dépense"
      });
      throw error;
    }
  }

  /**
   * Update an expense in the database
   */
  async updateExpense(expense: Expense): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Database not initialized in ExpenseManager.updateExpense");
      }
      
      if (!this.queryManager) {
        throw new Error("Query manager is null in ExpenseManager.updateExpense");
      }
      
      console.log(`Mise à jour de la dépense avec l'ID: ${expense.id}`);
      await this.queryManager.executeUpdateExpense(expense);
    } catch (error) {
      console.error("Error in ExpenseManager.updateExpense:", error);
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: "Impossible de mettre à jour la dépense"
      });
      throw error;
    }
  }

  /**
   * Delete an expense from the database
   */
  async deleteExpense(id: string): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Database not initialized in ExpenseManager.deleteExpense");
      }
      
      if (!this.queryManager) {
        throw new Error("Query manager is null in ExpenseManager.deleteExpense");
      }
      
      console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
      await this.queryManager.executeDeleteExpense(id);
    } catch (error) {
      console.error("Error in ExpenseManager.deleteExpense:", error);
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: "Impossible de supprimer la dépense"
      });
      throw error;
    }
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
