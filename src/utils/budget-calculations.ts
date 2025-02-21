
import { Budget } from "@/types/categories";
import { db } from "@/services/database";

export const calculateCategoryTotals = async (budgets: string[], availableBudgets: Budget[]) => {
  // Récupérer toutes les dépenses pour calculer le total des dépenses par budget
  const expenses = await db.getExpenses();
  
  // Calculer le total du budget et des dépenses pour tous les budgets assignés
  const totals = (Array.isArray(budgets) ? budgets : []).reduce((acc: { total: number, spent: number }, budgetId: string) => {
    const budget = availableBudgets.find(b => b.id === budgetId);
    if (budget) {
      // Calculer le total des dépenses pour ce budget spécifique
      const budgetExpenses = expenses.filter(expense => expense.linkedBudgetId === budgetId);
      const budgetSpent = budgetExpenses.reduce((sum, expense) => sum + Number(expense.budget), 0);

      return {
        total: acc.total + (budget.budget || 0),
        spent: acc.spent + budgetSpent
      };
    }
    return acc;
  }, { total: 0, spent: 0 });

  return totals;
};
