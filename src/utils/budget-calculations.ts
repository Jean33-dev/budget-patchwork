
import { Budget } from "@/types/categories";

export const calculateCategoryTotals = (budgets: string[], availableBudgets: Budget[]) => {
  const total = (Array.isArray(budgets) ? budgets : [])
    .reduce((sum: number, budgetId: string) => {
      const budget = availableBudgets.find(b => b.id === budgetId);
      return sum + (budget?.budget || 0);
    }, 0);

  const spent = (Array.isArray(budgets) ? budgets : [])
    .reduce((sum: number, budgetId: string) => {
      const budget = availableBudgets.find(b => b.id === budgetId);
      return sum + (budget?.spent || 0);
    }, 0);

  return { total, spent };
};
