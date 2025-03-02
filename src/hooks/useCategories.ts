
import { useCategoryManagement } from "./useCategoryManagement";
import { useBudgetAssignment } from "./useBudgetAssignment";
import { useTransitionHandling } from "./useTransitionHandling";

export const useCategories = () => {
  const { categories, updateCategoryName, setCategories, refreshCategories } = useCategoryManagement();
  const { 
    handleAssignBudget, 
    handleRemoveBudget, 
    getAvailableBudgetsForCategory,
    updateCategoryTotals 
  } = useBudgetAssignment(categories, setCategories);
  const { handleMonthTransition, getTransitionPreferences } = useTransitionHandling(categories, setCategories);

  return {
    categories,
    setCategories, // Expose setCategories function
    handleAssignBudget,
    handleRemoveBudget,
    updateCategoryName,
    getAvailableBudgetsForCategory,
    updateCategoryTotals,
    handleMonthTransition,
    getTransitionPreferences, // Also expose getTransitionPreferences
    refreshCategories
  };
};
