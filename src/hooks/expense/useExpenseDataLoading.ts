
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
    // Ensure we have a non-null, non-empty string for dashboardId
    if (!dashboardId) {
      console.log("🔍 useExpenseDataLoading - No dashboardId provided, skipping data load");
      setIsLoading(false);
      return;
    }
    
    const useDashboardId = String(dashboardId);
    console.log(`🔍 useExpenseDataLoading - Beginning data load for dashboard: "${useDashboardId}"`);
    
    setIsLoading(true);
    setError(null);
    
    try {
      await db.init();
      
      // Load budgets
      console.log("🔍 useExpenseDataLoading - Loading budgets");
      const loadedBudgets = await db.getBudgets();
      console.log(`🔍 useExpenseDataLoading - All budgets loaded from database (${loadedBudgets.length}):`, loadedBudgets);
      
      // Filter budgets strictly by dashboardId with detailed logging
      const filteredBudgets = loadedBudgets.filter(budget => {
        const budgetDashboardId = budget.dashboardId ? String(budget.dashboardId) : "";
        const match = budgetDashboardId === useDashboardId;
        
        console.log(`🔍 Budget filter: "${budget.title}" (dashboardId: "${budgetDashboardId}") vs current "${useDashboardId}" = ${match ? "MATCH" : "NO MATCH"}`);
        return match;
      });
      
      console.log(`🔍 useExpenseDataLoading - Filtered ${filteredBudgets.length} budgets for dashboard "${useDashboardId}" from ${loadedBudgets.length} total budgets`);
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
        const expenseDashboardId = expense.dashboardId ? String(expense.dashboardId) : "";
        const match = expenseDashboardId === useDashboardId;
        
        console.log(`🔍 Expense filter: "${expense.title}" (dashboardId: "${expenseDashboardId}") vs current "${useDashboardId}" = ${match ? "MATCH" : "NO MATCH"}`);
        return match;
      });
      
      console.log(`🔍 useExpenseDataLoading - Final filtered expenses (${filteredExpenses.length}) for dashboard "${useDashboardId}" from ${loadedExpenses.length} total expenses:`);
      filteredExpenses.forEach((expense, idx) => {
        if (idx < 5) { // Limit logging to first 5 for brevity
          // Correctement référencer le dashboardId de chaque dépense
          const expenseDashboardId = expense.dashboardId ? String(expense.dashboardId) : "";
          console.log(`🔍   - Expense ${idx+1}: "${expense.title}", dashboardId: "${expenseDashboardId}"`);
        }
      });
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
    console.log(`🔍 useExpenseDataLoading - Effect triggered with dashboardId: ${dashboardId || 'null'}`);
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
