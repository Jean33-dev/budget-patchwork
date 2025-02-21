
import { Budget } from "@/types/categories";
import { BudgetAssignmentUtils } from "@/types/budget-assignment";

export const createBudgetAssignmentUtils = (categories: any[]): BudgetAssignmentUtils => {
  const getAssignedBudgets = () => {
    console.log("Récupération des budgets assignés, catégories:", categories);
    const assignedBudgets = new Set<string>();
    categories.forEach(category => {
      if (Array.isArray(category.budgets)) {
        category.budgets.forEach((budgetId: string) => {
          assignedBudgets.add(budgetId);
        });
      }
    });
    console.log("Budgets actuellement assignés:", [...assignedBudgets]);
    return assignedBudgets;
  };

  const getAvailableBudgetsForCategory = (categoryId: string, availableBudgets: Budget[]) => {
    console.log("Recherche des budgets disponibles pour la catégorie:", categoryId);
    console.log("Tous les budgets disponibles:", availableBudgets);

    if (!Array.isArray(availableBudgets)) {
      console.error('availableBudgets n\'est pas un tableau');
      return [];
    }

    const assignedBudgets = getAssignedBudgets();
    const currentCategory = categories.find(cat => cat.id === categoryId);

    if (!currentCategory) {
      console.warn('Catégorie non trouvée');
      return availableBudgets;
    }

    const categoryBudgets = Array.isArray(currentCategory.budgets) ? currentCategory.budgets : [];
    console.log("Budgets de la catégorie courante:", categoryBudgets);

    // Un budget est disponible s'il n'est pas assigné à une autre catégorie
    const availableBudgetsForCategory = availableBudgets.filter(budget => {
      const isAssignedToOtherCategory = assignedBudgets.has(budget.id) && 
        !categoryBudgets.includes(budget.id);
      return !isAssignedToOtherCategory;
    });

    console.log("Budgets disponibles pour la catégorie:", availableBudgetsForCategory);
    return availableBudgetsForCategory;
  };

  return {
    getAssignedBudgets,
    getAvailableBudgetsForCategory
  };
};
