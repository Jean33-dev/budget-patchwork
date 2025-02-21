
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
          const total = (Array.isArray(category.budgets) ? category.budgets : [])
            .reduce((sum: number, budgetId: string) => {
              const budget = availableBudgets.find(b => b.id === budgetId);
              return sum + (budget?.budget || 0);
            }, 0);

          const spent = (Array.isArray(category.budgets) ? category.budgets : [])
            .reduce((sum: number, budgetId: string) => {
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
      console.log("État actuel des catégories:", categories);
      
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

      console.log("Catégories mises à jour:", updatedCategories);
      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        await db.updateCategory(updatedCategory);
        console.log("Catégorie sauvegardée en DB:", updatedCategory);
        
        // Mettre à jour les totaux après l'assignation
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
    const categoryBudgets = Array.isArray(currentCategory.budgets) ? currentCategory.budgets : [];

    const availableBudgetsForCategory = availableBudgets.filter(budget => {
      const isAssignedToOtherCategory = assignedBudgets.has(budget.id) && 
        !categoryBudgets.includes(budget.id);
      
      console.log(`Budget ${budget.id} (${budget.title}):`, {
        isAssignedToOtherCategory,
        isInCurrentCategory: categoryBudgets.includes(budget.id)
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
