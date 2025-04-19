
import { useState } from "react";
import { useBudgetData } from "./useBudgetData";
import { budgetOperations } from "@/utils/budget-operations";
import { Budget } from "@/types/categories";
import { useParams } from "react-router-dom";

export type { Budget };

export const useBudgets = () => {
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();
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
  if (budgets !== localBudgets && budgets.length > 0) {
    setLocalBudgets(budgets);
  }

  const addBudget = async (newBudget: Omit<Budget, "id" | "spent">) => {
    const success = await budgetOperations.addBudget(newBudget, dashboardId);
    if (success) {
      // Refresh data to include the new budget
      await loadData();
    }
    return success;
  };

  const updateBudget = async (budget: Budget) => {
    // Ensure the budget has the current dashboardId
    const budgetWithDashboardId = {
      ...budget,
      dashboardId: budget.dashboardId || dashboardId
    };
    
    const success = await budgetOperations.updateBudget(budgetWithDashboardId);
    if (success) {
      // Update local state immediately for better UX
      setLocalBudgets(prevBudgets => 
        prevBudgets.map(b => b.id === budget.id ? budgetWithDashboardId : b)
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
