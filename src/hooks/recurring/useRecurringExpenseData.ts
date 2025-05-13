
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/services/database/models/budget";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { format } from "date-fns";

/**
 * Hook for loading recurring expense data
 */
export const useRecurringExpenseData = () => {
  const { toast } = useToast();
  const [recurringExpenses, setRecurringExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const { currentDashboardId } = useDashboardContext();

  const loadData = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const expenses = await db.getRecurringExpenses();
      const budgets = await db.getBudgets();
      
      console.log("🔍 useRecurringExpenseData - All recurring expenses:", expenses);
      console.log("🔍 useRecurringExpenseData - Current dashboardId:", currentDashboardId);
      
      // Strict filtering by dashboardId
      const filteredExpenses = expenses.filter(expense => {
        if (!expense.dashboardId && !currentDashboardId) {
          return true; // If both are empty, it's a match
        }
        return String(expense.dashboardId || '') === String(currentDashboardId || '');
      });
      
      // Filter budgets for the current dashboard
      const filteredBudgets = budgets.filter(budget => 
        String(budget.dashboardId || '') === String(currentDashboardId || '')
      );
      
      console.log("🔍 useRecurringExpenseData - Filtered recurring expenses:", filteredExpenses);
      setRecurringExpenses(filteredExpenses);
      setAvailableBudgets(filteredBudgets);
    } catch (error) {
      console.error("🔍 Error loading recurring expenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les dépenses récurrentes"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔍 useRecurringExpenseData - Effect triggered with dashboardId:", currentDashboardId);
    loadData();
  }, [currentDashboardId]);

  return {
    recurringExpenses,
    setRecurringExpenses,
    availableBudgets,
    isLoading,
    loadData,
    currentDate
  };
};
