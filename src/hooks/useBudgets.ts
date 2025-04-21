
import { useState, useEffect } from "react";
import { useBudgetData } from "./useBudgetData";
import { budgetOperations } from "@/utils/budget-operations";
import { Budget } from "@/types/categories";
import { useDashboardContext } from "./useDashboardContext";

export type { Budget };

export const useBudgets = () => {
  const { currentDashboardId } = useDashboardContext();
  const { 
    budgets, 
    totalRevenues, 
    totalExpenses, 
    isLoading, 
    error, 
    loadData 
  } = useBudgetData();
  
  const [localBudgets, setLocalBudgets] = useState<Budget[]>([]);

  // Update local state whenever the fetched budgets change
  useEffect(() => {
    if (budgets && budgets.length > 0) {
      console.log("useBudgets - Setting local budgets:", budgets);
      setLocalBudgets(budgets);
    }
  }, [budgets]);

  const addBudget = async (newBudget: Omit<Budget, "id" | "spent" | "dashboardId">) => {
    // Toujours utiliser le dashboardId courant pour les nouveaux budgets
    const budgetWithDashboard = {
      ...newBudget,
      dashboardId: currentDashboardId
    };
    
    console.log(`useBudgets - Adding budget with dashboardId: ${currentDashboardId}`);
    
    const success = await budgetOperations.addBudget(budgetWithDashboard);
    if (success) {
      // Refresh data to include the new budget
      await loadData();
    }
    return success;
  };

  const updateBudget = async (budget: Budget) => {
    // S'assurer que le dashboardId est préservé ou défini
    if (!budget.dashboardId) {
      budget.dashboardId = currentDashboardId;
    }
    
    const success = await budgetOperations.updateBudget(budget);
    if (success) {
      // Update local state immediately for better UX
      setLocalBudgets(prevBudgets => 
        prevBudgets.map(b => b.id === budget.id ? budget : b)
      );
      
      // Also refresh data to ensure consistency
      await loadData();
    }
    return success;
  };

  const deleteBudget = async (id: string) => {
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
    refreshData: loadData
  };
};
