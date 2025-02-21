
import { Budget } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { createBudgetAssignmentUtils } from "@/utils/budget-assignment-utils";
import { calculateCategoryTotals } from "@/utils/budget-calculations";

export const useBudgetAssignment = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const budgetUtils = createBudgetAssignmentUtils(categories);

  const updateCategoryTotals = async (categoryId: string, availableBudgets: Budget[]) => {
    try {
      console.log("Mise à jour des totaux pour la catégorie:", categoryId);
      console.log("Budgets disponibles:", availableBudgets);
      
      const currentCategory = categories.find(c => c.id === categoryId);
      if (!currentCategory) {
        throw new Error("Catégorie non trouvée pour la mise à jour des totaux");
      }

      const { total, spent } = calculateCategoryTotals(currentCategory.budgets, availableBudgets);
      console.log("Nouveaux totaux calculés:", { total, spent });

      const updatedCategory = {
        ...currentCategory,
        total,
        spent
      };

      await db.updateCategory(updatedCategory);
      
      const updatedCategories = categories.map(category =>
        category.id === categoryId ? updatedCategory : category
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des totaux:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les totaux"
      });
    }
  };

  const handleAssignBudget = async (categoryId: string, budgetId: string, availableBudgets: Budget[]) => {
    try {
      console.log("Début de l'assignation du budget:", { categoryId, budgetId });
      
      const currentCategory = categories.find(c => c.id === categoryId);
      if (!currentCategory) {
        throw new Error("Catégorie non trouvée");
      }

      console.log("Catégorie avant mise à jour:", currentCategory);
      
      // S'assurer que budgets est un tableau
      const currentBudgets = Array.isArray(currentCategory.budgets) ? currentCategory.budgets : [];
      console.log("Budgets actuels:", currentBudgets);
      
      // Vérifier si le budget n'est pas déjà assigné
      if (currentBudgets.includes(budgetId)) {
        console.log("Budget déjà assigné, pas de modification nécessaire");
        return;
      }
      
      const newBudgets = [...currentBudgets, budgetId];
      console.log("Nouveaux budgets après ajout:", newBudgets);

      const { total, spent } = calculateCategoryTotals(newBudgets, availableBudgets);
      console.log("Nouveaux totaux calculés:", { total, spent });

      const updatedCategory = {
        ...currentCategory,
        budgets: newBudgets,
        total,
        spent
      };

      console.log("Catégorie mise à jour avant sauvegarde:", updatedCategory);
      await db.updateCategory(updatedCategory);

      const updatedCategories = categories.map(category =>
        category.id === categoryId ? updatedCategory : category
      );
      setCategories(updatedCategories);

      toast({
        title: "Budget assigné",
        description: "Le budget a été assigné à la catégorie avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'assignation du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'assigner le budget"
      });
      throw error;
    }
  };

  const handleRemoveBudget = async (categoryId: string, budgetId: string, availableBudgets: Budget[]) => {
    try {
      console.log("Début du retrait du budget:", { categoryId, budgetId });
      
      const currentCategory = categories.find(c => c.id === categoryId);
      if (!currentCategory) {
        throw new Error("Catégorie non trouvée");
      }

      const currentBudgets = Array.isArray(currentCategory.budgets) ? currentCategory.budgets : [];
      console.log("Budgets actuels:", currentBudgets);
      
      const newBudgets = currentBudgets.filter(b => b !== budgetId);
      console.log("Nouveaux budgets après retrait:", newBudgets);

      const { total, spent } = calculateCategoryTotals(newBudgets, availableBudgets);
      console.log("Nouveaux totaux calculés:", { total, spent });

      const updatedCategory = {
        ...currentCategory,
        budgets: newBudgets,
        total,
        spent
      };

      console.log("Catégorie mise à jour avant sauvegarde:", updatedCategory);
      await db.updateCategory(updatedCategory);

      const updatedCategories = categories.map(category =>
        category.id === categoryId ? updatedCategory : category
      );
      setCategories(updatedCategories);

      toast({
        title: "Budget retiré",
        description: "Le budget a été retiré de la catégorie avec succès."
      });
    } catch (error) {
      console.error("Erreur lors du retrait du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le budget"
      });
      throw error;
    }
  };

  return {
    handleAssignBudget,
    handleRemoveBudget,
    getAvailableBudgetsForCategory: budgetUtils.getAvailableBudgetsForCategory,
    updateCategoryTotals
  };
};
