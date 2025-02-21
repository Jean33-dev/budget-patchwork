
import { Budget } from "@/types/categories";
import { BudgetAssignmentUtils } from "@/types/budget-assignment";

export const createBudgetAssignmentUtils = (categories: any[]): BudgetAssignmentUtils => {
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

  const getAvailableBudgetsForCategory = (categoryId: string, availableBudgets: Budget[]) => {
    if (!Array.isArray(availableBudgets)) {
      console.error('availableBudgets n\'est pas un tableau');
      return [];
    }

    const assignedBudgets = getAssignedBudgets();
    const currentCategory = categories.find(cat => cat.id === categoryId);

    if (!currentCategory) {
      console.warn('Catégorie non trouvée');
      return [];
    }

    const categoryBudgets = Array.isArray(currentCategory.budgets) ? currentCategory.budgets : [];

    return availableBudgets.filter(budget => {
      const isAssignedToOtherCategory = assignedBudgets.has(budget.id) && 
        !categoryBudgets.includes(budget.id);
      return !isAssignedToOtherCategory;
    });
  };

  return {
    getAssignedBudgets,
    getAvailableBudgetsForCategory
  };
};
