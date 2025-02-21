
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
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const { total, spent } = calculateCategoryTotals(category.budgets, availableBudgets);
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
      const selectedBudget = availableBudgets.find(b => b.id === budgetId);
      if (!selectedBudget) {
        console.error("Budget non trouvé:", budgetId);
        return;
      }

      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const currentBudgets = Array.isArray(category.budgets) ? category.budgets : [];
          return {
            ...category,
            budgets: [...currentBudgets, budgetId]
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
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

  const handleRemoveBudget = async (categoryId: string, budgetId: string) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const currentBudgets = Array.isArray(category.budgets) ? category.budgets : [];
          return {
            ...category,
            budgets: currentBudgets.filter(b => b !== budgetId)
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        await db.updateCategory(updatedCategory);
      }

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
    }
  };

  return {
    handleAssignBudget,
    handleRemoveBudget,
    getAvailableBudgetsForCategory: budgetUtils.getAvailableBudgetsForCategory,
    updateCategoryTotals
  };
};
