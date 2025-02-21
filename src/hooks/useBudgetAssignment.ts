import { Budget } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

export const useBudgetAssignment = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();

  const getAssignedBudgets = () => {
    const assignedBudgets = new Set<string>();
    categories.forEach(category => {
      if (Array.isArray(category.budgets)) {
        category.budgets.forEach((budgetId: string) => {
          assignedBudgets.add(budgetId);
        });
      }
    });
    return assignedBudgets;
  };

  const updateCategoryTotals = async (categoryId: string, availableBudgets: Budget[]) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const total = category.budgets.reduce((sum: number, budgetId: string) => {
            const budget = availableBudgets.find(b => b.id === budgetId);
            return sum + (budget?.budget || 0);
          }, 0);

          const spent = category.budgets.reduce((sum: number, budgetId: string) => {
            const budget = availableBudgets.find(b => b.id === budgetId);
            return sum + (budget?.spent || 0);
          }, 0);

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
      console.log("Tentative d'assignation:", { categoryId, budgetId });
      const selectedBudget = availableBudgets.find(b => b.id === budgetId);
      if (!selectedBudget) {
        console.error("Budget non trouvé:", budgetId);
        return;
      }

      const assignedBudgets = getAssignedBudgets();
      if (assignedBudgets.has(budgetId)) {
        toast({
          variant: "destructive",
          title: "Budget déjà assigné",
          description: "Ce budget est déjà assigné à une autre catégorie."
        });
        return;
      }

      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const newBudgets = Array.isArray(category.budgets) ? 
            [...category.budgets, budgetId] : 
            [budgetId];
          
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
        await db.updateCategory(updatedCategory);
        console.log("Catégorie sauvegardée en DB:", updatedCategory);
      }

      await updateCategoryTotals(categoryId, availableBudgets);

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
    }
  };

  const handleRemoveBudget = async (categoryId: string, budgetId: string) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            budgets: Array.isArray(category.budgets) ? 
              category.budgets.filter(b => b !== budgetId) : 
              []
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

  const getAvailableBudgetsForCategory = (categoryId: string, availableBudgets: Budget[]) => {
    console.log('=== Début getAvailableBudgetsForCategory ===');
    console.log('categoryId:', categoryId);
    console.log('Tous les budgets disponibles:', availableBudgets);

    // Vérifier que les budgets sont bien formés
    if (!Array.isArray(availableBudgets)) {
      console.error('availableBudgets n\'est pas un tableau');
      return [];
    }

    const assignedBudgets = getAssignedBudgets();
    console.log('Budgets déjà assignés (Set):', Array.from(assignedBudgets));

    const currentCategory = categories.find(cat => cat.id === categoryId);
    console.log('Catégorie courante:', currentCategory);

    if (!currentCategory) {
      console.warn('Catégorie non trouvée');
      return [];
    }

    // S'assurer que currentCategory.budgets est un tableau
    if (!Array.isArray(currentCategory.budgets)) {
      console.warn('Les budgets de la catégorie ne sont pas un tableau');
      currentCategory.budgets = [];
    }

    const availableBudgetsForCategory = availableBudgets.filter(budget => {
      const isAssignedToOtherCategory = assignedBudgets.has(budget.id) && 
        !currentCategory.budgets.includes(budget.id);
      
      console.log(`Budget ${budget.id} (${budget.title}):`, {
        isAssignedToOtherCategory,
        isInCurrentCategory: currentCategory.budgets.includes(budget.id)
      });

      return !isAssignedToOtherCategory;
    });

    console.log('Budgets disponibles pour cette catégorie:', availableBudgetsForCategory);
    console.log('=== Fin getAvailableBudgetsForCategory ===');

    return availableBudgetsForCategory;
  };

  return {
    handleAssignBudget,
    handleRemoveBudget,
    getAvailableBudgetsForCategory,
    updateCategoryTotals
  };
};
