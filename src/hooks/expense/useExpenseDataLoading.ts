
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
      
      // Filter budgets strictly by dashboardId
      const filteredBudgets = loadedBudgets.filter(budget => {
        // Normaliser les deux dashboardIds en strings
        const budgetDashboardId = budget.dashboardId ? String(budget.dashboardId) : "";
        const currentDashboardId = String(useDashboardId);
        const match = budgetDashboardId === currentDashboardId;
        
        console.log(`🔍 Budget filter: "${budget.title}" (${budgetDashboardId || 'null'}) vs current "${currentDashboardId}" = ${match}`);
        return match;
      });
      
      console.log(`🔍 useExpenseDataLoading - Filtered ${filteredBudgets.length} budgets for dashboard ${useDashboardId}`);
      setAvailableBudgets(filteredBudgets);
      
      // Load expenses
      console.log("🔍 useExpenseDataLoading - Loading expenses");
      const loadedExpenses = await db.getExpenses();
      console.log(`🔍 useExpenseDataLoading - All expenses loaded from database (${loadedExpenses.length}):`, loadedExpenses);
      
      // Filter out recurring expenses
      const nonRecurringExpenses = loadedExpenses.filter(expense => !expense.isRecurring);
      console.log(`🔍 useExpenseDataLoading - Non-recurring expenses (${nonRecurringExpenses.length}):`, nonRecurringExpenses);
      
      // Filter expenses strictly by dashboardId
      const filteredExpenses = nonRecurringExpenses.filter(expense => {
        // Normaliser les deux dashboardIds en strings
        const expenseDashboardId = expense.dashboardId ? String(expense.dashboardId) : "";
        const currentDashboardId = String(useDashboardId);
        const match = expenseDashboardId === currentDashboardId;
        
        console.log(`🔍 Expense filter: "${expense.title}" (${expenseDashboardId || 'null'}) vs current "${currentDashboardId}" = ${match}`);
        return match;
      });
      
      console.log(`🔍 useExpenseDataLoading - Final filtered expenses (${filteredExpenses.length}):`, filteredExpenses);
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
