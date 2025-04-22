
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { v4 as uuidv4 } from "uuid";

export const budgetOperations = {
  async addBudget(newBudget: Omit<Budget, "id" | "spent">): Promise<boolean> {
    try {
      const budgetToAdd: Budget = {
        id: uuidv4(),
        title: newBudget.title,
        budget: newBudget.budget,
        spent: 0,
        type: "budget"
      };

      console.log("Ajout d'un nouveau budget:", budgetToAdd);
      await db.addBudget(budgetToAdd);
      
      toast({
        title: "Budget ajouté",
        description: `Le budget "${newBudget.title}" a été créé avec succès.`
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le budget"
      });
      return false;
    }
  },

  async updateBudget(budgetToUpdate: Budget): Promise<boolean> {
    try {
      await db.updateBudget(budgetToUpdate);
      
      toast({
        title: "Budget modifié",
        description: `Le budget "${budgetToUpdate.title}" a été mis à jour.`
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la modification du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le budget"
      });
      return false;
    }
  },

  async deleteBudget(budgetId: string): Promise<boolean> {
    try {
      const expenses = await db.getExpenses();
      const hasLinkedExpenses = expenses.some(expense => 
        expense.linkedBudgetId === budgetId
      );
      
      if (hasLinkedExpenses) {
        toast({
          variant: "destructive",
          title: "Suppression impossible",
          description: "Ce budget a des dépenses qui lui sont affectées."
        });
        return false;
      }

      await db.deleteBudget(budgetId);
      
      toast({
        title: "Budget supprimé",
        description: "Le budget a été supprimé avec succès."
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le budget"
      });
      return false;
    }
  }
};
