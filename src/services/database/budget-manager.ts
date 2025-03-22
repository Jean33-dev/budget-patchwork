
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
          title: "Erreur de base de données",
          description: "La base de données n'a pas pu être initialisée correctement."
        });
        return [];
      }
      
      const budgets = budgetQueries.getAll(this.db);
      console.log("Budgets fetched successfully:", budgets.length);
      return budgets;
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les budgets. Veuillez rafraîchir la page."
      });
      return [];
    }
  }

  async addBudget(budget: Budget) {
    try {
      console.log("Ajout d'un nouveau budget:", budget);
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      budgetQueries.add(this.db, budget);
      console.log("Budget ajouté avec succès");
      
      toast({
        title: "Budget ajouté",
        description: `Le budget "${budget.title}" a été ajouté avec succès.`
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le budget. Veuillez réessayer."
      });
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    try {
      console.log("Mise à jour du budget:", budget);
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      budgetQueries.update(this.db, budget);
      console.log("Budget mis à jour avec succès");
      
      toast({
        title: "Budget mis à jour",
        description: `Le budget "${budget.title}" a été mis à jour avec succès.`
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le budget. Veuillez réessayer."
      });
      throw error;
    }
  }

  async deleteBudget(id: string) {
    try {
      console.log("Suppression du budget:", id);
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      budgetQueries.delete(this.db, id);
      console.log("Budget supprimé avec succès");
      
      toast({
        title: "Budget supprimé",
        description: "Le budget a été supprimé avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le budget. Veuillez réessayer."
      });
      throw error;
    }
  }
}
