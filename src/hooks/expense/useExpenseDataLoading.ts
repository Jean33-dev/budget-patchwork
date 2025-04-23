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
      
      // Filter budgets for the current dashboard - IMPROVED FILTERING LOGIC
      let filteredBudgets;
      
      if (useDashboardId === "budget") {
        // For "budget" route, include all budgets regardless of dashboardId
        // This ensures all budgets are available when on the budget route
        filteredBudgets = loadedBudgets;
        console.log(`🔍 useExpenseDataLoading - On budget route: including ALL ${filteredBudgets.length} budgets`);
      } else {
        // Otherwise, show only budgets for the current dashboard
        filteredBudgets = loadedBudgets.filter(b => b.dashboardId === useDashboardId);
        console.log(`🔍 useExpenseDataLoading - Filtered ${filteredBudgets.length} budgets for dashboard ${useDashboardId}`);
      }
      
      console.log(`🔍 useExpenseDataLoading - Final filtered budgets:`, filteredBudgets);
      setAvailableBudgets(filteredBudgets);
      
      // Load expenses
      console.log("🔍 useExpenseDataLoading - Loading expenses");
      const loadedExpenses = await db.getExpenses();
      console.log(`🔍 useExpenseDataLoading - All expenses loaded from database (${loadedExpenses.length}):`, loadedExpenses);
      
      // Filter out recurring expenses
      const nonRecurringExpenses = loadedExpenses.filter(expense => !expense.isRecurring);
      console.log(`🔍 useExpenseDataLoading - Non-recurring expenses (${nonRecurringExpenses.length}):`, nonRecurringExpenses);
      
      // Filter expenses for the current dashboard - STRICT EQUAL COMPARISON
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
        // USING STRICT EQUALITY for dashboard ID comparison
        filteredExpenses = nonRecurringExpenses.filter(expense => {
          // Utilisons une comparaison stricte pour le dashboardId
          const exactMatch = expense.dashboardId === useDashboardId;
          console.log(`🔍 Expense ${expense.id} (${expense.title}) with dashboardId=${expense.dashboardId} comparing with ${useDashboardId}: exactMatch=${exactMatch}`);
          return exactMatch;
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
