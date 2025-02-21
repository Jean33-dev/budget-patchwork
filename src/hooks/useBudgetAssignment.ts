
import { Budget } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

export const useBudgetAssignment = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();

  const getAssignedBudgets = () => {
    const assignedBudgets = new Set<string>();
    categories.forEach(category => {
      category.budgets.forEach((budget: string) => {
        assignedBudgets.add(budget);
      });
    });
    return assignedBudgets;
  };

  const updateCategoryTotals = async (categoryId: string, availableBudgets: Budget[]) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const total = category.budgets.reduce((sum: number, budgetTitle: string) => {
            const budget = availableBudgets.find(b => b.title === budgetTitle);
            return sum + (budget?.budget || 0);
          }, 0);

          const spent = category.budgets.reduce((sum: number, budgetTitle: string) => {
            const budget = availableBudgets.find(b => b.title === budgetTitle);
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
      const selectedBudget = availableBudgets.find(b => b.id === budgetId);
      if (!selectedBudget) return;

      const assignedBudgets = getAssignedBudgets();
      if (assignedBudgets.has(selectedBudget.title)) {
        toast({
          variant: "destructive",
          title: "Budget déjà assigné",
          description: "Ce budget est déjà assigné à une autre catégorie."
        });
        return;
      }

      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            budgets: [...category.budgets, selectedBudget.title]
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        await db.updateCategory(updatedCategory);
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

  const handleRemoveBudget = async (categoryId: string, budgetTitle: string) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            budgets: category.budgets.filter(b => b !== budgetTitle)
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
    const assignedBudgets = getAssignedBudgets();
    const currentCategory = categories.find(cat => cat.id === categoryId);
    
    return availableBudgets.filter(budget => 
      !assignedBudgets.has(budget.title) || 
      (currentCategory && currentCategory.budgets.includes(budget.title))
    );
  };

  return {
    handleAssignBudget,
    handleRemoveBudget,
    getAvailableBudgetsForCategory,
    updateCategoryTotals
  };
};
