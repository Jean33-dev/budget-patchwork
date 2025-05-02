
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/services/database/models/budget";
import { v4 as uuidv4 } from "uuid";

export const budgetOperations = {
  async addBudget(newBudget: Omit<Budget, "id" | "spent">, dashboardId?: string): Promise<boolean> {
    try {
      // Récupérer le dashboardId du contexte si non fourni explicitement
      const actualDashboardId = dashboardId || 
        (typeof window !== 'undefined' ? 
          localStorage.getItem('currentDashboardId') : null);
          
      if (!actualDashboardId) {
        console.error("Budget operation - Aucun dashboardId trouvé pour l'ajout d'un budget");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter le budget: ID du tableau de bord manquant"
        });
        return false;
      }

      console.log("Budget operation - Using dashboardId:", actualDashboardId);
      
      const budgetToAdd: Budget = {
        id: uuidv4(),
        title: newBudget.title,
        budget: newBudget.budget,
        spent: 0,
        type: "budget",
        carriedOver: newBudget.carriedOver || 0, // Ensure carriedOver is always set
        dashboardId: actualDashboardId
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
      // S'assurer que le dashboardId est préservé
      const dashboardId = budgetToUpdate.dashboardId || 
        (typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null);
        
      if (!dashboardId) {
        console.error("Budget operation - Aucun dashboardId trouvé pour la mise à jour d'un budget");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de modifier le budget: ID du tableau de bord manquant"
        });
        return false;
      }
      
      const budget = {
        ...budgetToUpdate,
        dashboardId: dashboardId
      };
      
      await db.updateBudget(budget);
      
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
