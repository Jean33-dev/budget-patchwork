
import { useState, useEffect } from "react";
import { useBudgetData } from "./useBudgetData";
import { budgetOperations } from "@/utils/budget-operations";
import { Budget } from "@/types/categories";
import { useDashboardContext } from "./useDashboardContext";

export type { Budget };

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

  // Stocker le dashboardId courant dans localStorage pour accès global
  useEffect(() => {
    if (currentDashboardId) {
      console.log("useBudgets: Setting currentDashboardId in localStorage:", currentDashboardId);
      localStorage.setItem('currentDashboardId', currentDashboardId);
    }
  }, [currentDashboardId]);

  // Update local state whenever the fetched budgets change
  useEffect(() => {
    if (budgets.length > 0 || localBudgets.length !== budgets.length) {
      console.log("useBudgets: Updating local budgets state with:", budgets);
      setLocalBudgets(budgets);
    }
  }, [budgets]);

  const addBudget = async (newBudget: Omit<Budget, "id" | "spent">) => {
    console.log("useBudgets - Adding budget with dashboardId:", currentDashboardId);
    const success = await budgetOperations.addBudget(newBudget, currentDashboardId);
    if (success) {
      // Refresh data to include the new budget
      await loadData();
    }
    return success;
  };

  const updateBudget = async (budget: Budget) => {
    // S'assurer que le dashboardId est présent
    const budgetWithDashboard = {
      ...budget,
      dashboardId: budget.dashboardId || currentDashboardId
    };
    
    console.log("useBudgets - Updating budget with dashboardId:", budgetWithDashboard.dashboardId);
    const success = await budgetOperations.updateBudget(budgetWithDashboard);
    if (success) {
      // Update local state immediately for better UX
      setLocalBudgets(prevBudgets => 
        prevBudgets.map(b => b.id === budget.id ? budgetWithDashboard : b)
      );
      
      // Also refresh data to ensure consistency
      await loadData();
    }
    return success;
  };

  const deleteBudget = async (id: string) => {
    console.log("useBudgets - Deleting budget:", id);
    const success = await budgetOperations.deleteBudget(id);
    if (success) {
      // Update local state immediately for better UX
      setLocalBudgets(prevBudgets => prevBudgets.filter(b => b.id !== id));
      
      // Also refresh data to ensure consistency
      await loadData();
    }
    return success;
  };

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
