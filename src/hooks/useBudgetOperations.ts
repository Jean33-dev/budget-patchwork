
import { useCallback } from "react";
import { budgetOperations } from "@/utils/budget-operations";
import { Budget } from "@/types/categories";

/**
 * Hook pour gérer les opérations sur les budgets
 */
export const useBudgetOperations = (
  currentDashboardId: string | null,
  loadData: () => Promise<void>
) => {
  /**
   * Ajoute un nouveau budget
   */
  const addBudget = useCallback(async (newBudget: Omit<Budget, "id" | "spent">) => {
    if (!currentDashboardId) return false;
    
    const success = await budgetOperations.addBudget(newBudget, currentDashboardId);
    if (success) {
      await loadData();
    }
    return success;
  }, [currentDashboardId, loadData]);

  /**
   * Met à jour un budget existant
   */
  const updateBudget = useCallback(async (budget: Budget) => {
    // S'assurer que le dashboardId est présent
    const budgetWithDashboard = {
      ...budget,
      dashboardId: budget.dashboardId || currentDashboardId
    };
    
    const success = await budgetOperations.updateBudget(budgetWithDashboard);
    if (success) {
      await loadData();
    }
    return success;
  }, [currentDashboardId, loadData]);

  /**
   * Supprime un budget
   */
  const deleteBudget = useCallback(async (id: string) => {
    const success = await budgetOperations.deleteBudget(id);
    if (success) {
      await loadData();
    }
    return success;
  }, [loadData]);

  return {
    addBudget,
    updateBudget,
    deleteBudget
  };
};
