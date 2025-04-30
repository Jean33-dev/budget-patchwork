
import { useState, useEffect } from "react";
import { useBudgetData } from "./useBudgetData";
import { useBudgetOperations } from "./useBudgetOperations";
import { Budget } from "@/types/categories";
import { useDashboardContext } from "./useDashboardContext";

export type { Budget };

/**
 * Hook principal pour la gestion des budgets
 */
export const useBudgets = () => {
  const { 
    budgets, 
    totalRevenues, 
    totalExpenses, 
    isLoading, 
    error, 
    loadData 
  } = useBudgetData();
  
  const [localBudgets, setLocalBudgets] = useState<Budget[]>([]);
  const { currentDashboardId } = useDashboardContext();
  const { addBudget, updateBudget, deleteBudget } = useBudgetOperations(currentDashboardId, loadData);

  // Mettre à jour l'état local lorsque les budgets récupérés changent
  useEffect(() => {
    if (budgets.length > 0 || localBudgets.length !== budgets.length) {
      setLocalBudgets(budgets);
    }
  }, [budgets, localBudgets.length]);

  // Stocker le dashboardId courant dans localStorage pour accès global
  useEffect(() => {
    if (currentDashboardId) {
      localStorage.setItem('currentDashboardId', currentDashboardId);
    }
  }, [currentDashboardId]);

  const totalBudgets = localBudgets.reduce((sum, budget) => sum + budget.budget, 0);
  const remainingAmount = totalRevenues - totalBudgets;

  return {
    budgets: localBudgets,
    totalRevenues,
    totalBudgets,
    totalExpenses,
    remainingAmount,
    isLoading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshData: loadData,
    dashboardId: currentDashboardId
  };
};
