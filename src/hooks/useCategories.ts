
import { useCategoryManagement } from "./useCategoryManagement";
import { useBudgetAssignment } from "./useBudgetAssignment";
import { useTransitionHandling } from "./useTransitionHandling";

export const useCategories = () => {
  const { categories, updateCategoryName, setCategories } = useCategoryManagement();
  const { 
    handleAssignBudget, 
    handleRemoveBudget, 
    getAvailableBudgetsForCategory,
    updateCategoryTotals 
  } = useBudgetAssignment(categories, setCategories);
  const { handleMonthTransition } = useTransitionHandling(categories, setCategories);

  return {
    categories,
    handleAssignBudget,
    handleRemoveBudget,
    updateCategoryName,
    getAvailableBudgetsForCategory,
    updateCategoryTotals,
    handleMonthTransition
  };
};
