
import { Budget } from "@/services/database/models/budget";

/**
 * Hook for utility functions related to recurring expenses
 */
export const useRecurringExpenseUtilities = (availableBudgets: Budget[]) => {
  const getBudgetName = (budgetId?: string) => {
    if (!budgetId) return "Aucun budget";
    const budget = availableBudgets.find(b => b.id === budgetId);
    return budget ? budget.title : "Budget inconnu";
  };

  return {
    getBudgetName
  };
};
