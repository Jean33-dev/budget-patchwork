
import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';
import { toast } from "@/components/ui/use-toast";

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    try {
      console.log("Fetching expenses...");
      await this.ensureInitialized();
      
      if (!this.db) {
        console.error("Database is null after initialization");
        toast({
          variant: "destructive",
          title: "Erreur de base de données",
          description: "La base de données n'a pas pu être initialisée correctement."
        });
        return [];
      }
      
      const expenses = expenseQueries.getAll(this.db);
      console.log("Expenses fetched successfully:", expenses.length);
      return expenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les dépenses. Veuillez rafraîchir la page."
      });
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      console.log("Adding expense:", expense);
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      expenseQueries.add(this.db, expense);
      console.log("Expense added successfully");
      
      toast({
        title: "Dépense ajoutée",
        description: `La dépense "${expense.title}" a été ajoutée avec succès.`
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense. Veuillez réessayer."
      });
      return Promise.reject(error);
    }
  }
  
  async deleteExpense(id: string): Promise<void> {
    try {
      console.log(`Starting deletion of expense with ID: ${id}`);
      
      if (!id) {
        const error = new Error("ID de dépense manquant pour la suppression");
        console.error(error);
        return Promise.reject(error);
      }
      
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      console.log(`Initialized database, proceeding with deletion of expense ID: ${id}`);
      
      expenseQueries.delete(this.db, id);
      console.log(`Expense with ID: ${id} deleted successfully`);
      
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de la suppression d'une dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense. Veuillez réessayer."
      });
      return Promise.reject(error);
    }
  }
}
