
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
      
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const { total, spent } = calculateCategoryTotals(category.budgets, availableBudgets);
          console.log("Nouveaux totaux calculés:", { total, spent });
          return {
            ...category,
            total,
            spent
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        console.log("Mise à jour de la catégorie dans la DB:", updatedCategory);
        await db.updateCategory(updatedCategory);
      }
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
      console.log("Assignation du budget:", { categoryId, budgetId });
      console.log("État actuel des catégories:", categories);
      
      const selectedBudget = availableBudgets.find(b => b.id === budgetId);
      if (!selectedBudget) {
        console.error("Budget non trouvé:", budgetId);
        return;
      }

      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const currentBudgets = Array.isArray(category.budgets) ? category.budgets : [];
          const newBudgets = [...currentBudgets, budgetId];
          console.log("Nouveaux budgets de la catégorie:", newBudgets);
          return {
            ...category,
            budgets: newBudgets
          };
        }
        return category;
      });

      console.log("Catégories mises à jour:", updatedCategories);
      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        console.log("Sauvegarde de la catégorie dans la DB:", updatedCategory);
        await db.updateCategory(updatedCategory);
        await updateCategoryTotals(categoryId, availableBudgets);

        toast({
          title: "Budget assigné",
          description: "Le budget a été assigné à la catégorie avec succès."
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'assigner le budget"
      });
    }
  };

  const handleRemoveBudget = async (categoryId: string, budgetId: string, availableBudgets: Budget[]) => {
    try {
      console.log("Retrait du budget:", { categoryId, budgetId });
      
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const currentBudgets = Array.isArray(category.budgets) ? category.budgets : [];
          const newBudgets = currentBudgets.filter(b => b !== budgetId);
          console.log("Nouveaux budgets de la catégorie après retrait:", newBudgets);
          return {
            ...category,
            budgets: newBudgets
          };
        }
        return category;
      });

      console.log("Catégories mises à jour après retrait:", updatedCategories);
      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        console.log("Sauvegarde de la catégorie dans la DB après retrait:", updatedCategory);
        await db.updateCategory(updatedCategory);
        await updateCategoryTotals(categoryId, availableBudgets);

        toast({
          title: "Budget retiré",
          description: "Le budget a été retiré de la catégorie avec succès."
        });
      }
    } catch (error) {
      console.error("Erreur lors du retrait du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le budget"
      });
    }
  };

  return {
    handleAssignBudget,
    handleRemoveBudget,
    getAvailableBudgetsForCategory: budgetUtils.getAvailableBudgetsForCategory,
    updateCategoryTotals
  };
};
