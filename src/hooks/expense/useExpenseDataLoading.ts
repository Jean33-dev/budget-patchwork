
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { Expense } from "@/services/database/models/expense";

export const useExpenseDataLoading = (dashboardId: string | null) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  const loadData = useCallback(async () => {
    const useDashboardId = dashboardId || "default";
    console.log(`🔍 useExpenseDataLoading - Beginning data load for dashboard: ${useDashboardId}`);
    
    setIsLoading(true);
    setError(null);
    
    try {
      await db.init();
      
      // Load budgets
      console.log("🔍 useExpenseDataLoading - Loading budgets");
      const loadedBudgets = await db.getBudgets();
      console.log(`🔍 useExpenseDataLoading - All budgets loaded from database (${loadedBudgets.length}):`, loadedBudgets);
      
      // Filter budgets for the current dashboard
      const filteredBudgets = useDashboardId === "budget" 
        // Special handling for "budget" - show all budgets with no dashboardId or with default dashboardId
        ? loadedBudgets.filter(b => !b.dashboardId || b.dashboardId === "default")
        // Otherwise, show only budgets for the current dashboard
        : loadedBudgets.filter(b => b.dashboardId === useDashboardId);
      
      console.log(`🔍 useExpenseDataLoading - Filtered budgets for dashboard ${useDashboardId}:`, filteredBudgets);
      setAvailableBudgets(filteredBudgets);
      
      // Load expenses
      console.log("🔍 useExpenseDataLoading - Loading expenses");
      const loadedExpenses = await db.getExpenses();
      console.log(`🔍 useExpenseDataLoading - All expenses loaded from database (${loadedExpenses.length}):`, loadedExpenses);
      
      // Filter out recurring expenses
      const nonRecurringExpenses = loadedExpenses.filter(expense => !expense.isRecurring);
      console.log(`🔍 useExpenseDataLoading - Non-recurring expenses (${nonRecurringExpenses.length}):`, nonRecurringExpenses);
      
      // Filter expenses for the current dashboard - CORRECTED LOGIC
      let filteredExpenses;
      
      if (useDashboardId === "budget") {
        // For "budget" route, show expenses with no dashboardId, default dashboardId, or budget dashboardId
        filteredExpenses = nonRecurringExpenses.filter(expense => {
          const shouldInclude = !expense.dashboardId || 
                      expense.dashboardId === "default" || 
                      expense.dashboardId === "budget";
          console.log(`🔍 Expense ${expense.id} (${expense.title}) with dashboardId=${expense.dashboardId} on budget route: include=${shouldInclude}`);
          return shouldInclude;
        });
      } else {
        // For other dashboards, show ONLY expenses for that specific dashboard
        // This is the key fix - strict equality check for dashboard ID
        filteredExpenses = nonRecurringExpenses.filter(expense => {
          const shouldInclude = expense.dashboardId === useDashboardId;
          console.log(`🔍 Expense ${expense.id} (${expense.title}) with dashboardId=${expense.dashboardId} on dashboard ${useDashboardId}: include=${shouldInclude}`);
          return shouldInclude;
        });
      }
      
      console.log(`🔍 useExpenseDataLoading - Filtered expenses for dashboard ${useDashboardId} (${filteredExpenses.length}):`, filteredExpenses);
      setExpenses(filteredExpenses);
      
      setInitAttempted(true);
    } catch (error) {
      console.error(`🔍 useExpenseDataLoading - Error loading data for dashboard ${useDashboardId}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
      setError(error instanceof Error ? error : new Error("Failed to load data"));
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId, toast]);

  useEffect(() => {
    console.log(`🔍 useExpenseDataLoading - Effect triggered with dashboardId: ${dashboardId}`);
    loadData();
  }, [loadData, dashboardId]);

  return {
    expenses,
    availableBudgets,
    isLoading,
    error,
    initAttempted,
    loadData
  };
};
