
import { toast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { v4 as uuidv4 } from "uuid";
import { Budget } from "@/types/categories";

export const budgetOperations = {
  async addBudget(data: Omit<Budget, "id" | "spent">, dashboardId: string = "default"): Promise<boolean> {
    try {
      console.log("budgetOperations.addBudget: Starting with data:", data);
      
      const budget: Budget = {
        id: uuidv4(),
        title: data.title,
        budget: Number(data.budget) || 0,
        spent: 0,
        type: "budget",
        categoryId: data.categoryId,
        dashboardId: dashboardId
      };

      console.log("budgetOperations.addBudget: Created budget object:", budget);
      await db.addBudget(budget);
      console.log("budgetOperations.addBudget: Budget added successfully");
      
      toast({
        title: "Budget ajouté",
        description: `Le budget "${budget.title}" a été ajouté avec succès.`
      });
      
      return true;
    } catch (error) {
      console.error("Error adding budget:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le budget."
      });
      
      return false;
    }
  },

  async updateBudget(budgetToUpdate: Budget): Promise<boolean> {
    try {
      console.log("budgetOperations.updateBudget: Starting with data:", budgetToUpdate);
      
      if (!budgetToUpdate.id) {
        console.error("budgetOperations.updateBudget: Missing budget ID");
        return false;
      }

      await db.updateBudget(budgetToUpdate);
      console.log("budgetOperations.updateBudget: Budget updated successfully");
      
      toast({
        title: "Budget mis à jour",
        description: `Le budget "${budgetToUpdate.title}" a été mis à jour avec succès.`
      });
      
      return true;
    } catch (error) {
      console.error("Error updating budget:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le budget."
      });
      
      return false;
    }
  },

  async deleteBudget(budgetId: string): Promise<boolean> {
    try {
      console.log(`budgetOperations.deleteBudget: Starting with ID: ${budgetId}`);
      
      if (!budgetId) {
        console.error("budgetOperations.deleteBudget: Missing budget ID");
        return false;
      }

      await db.deleteBudget(budgetId);
      console.log(`budgetOperations.deleteBudget: Budget ${budgetId} deleted successfully`);
      
      toast({
        title: "Budget supprimé",
        description: "Le budget a été supprimé avec succès."
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting budget:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le budget."
      });
      
      return false;
    }
  }
};
