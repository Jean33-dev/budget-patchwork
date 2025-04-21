
import { useState, useEffect } from "react";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

export const useExpenseDataLoading = (dashboardId: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  const loadData = async () => {
    console.log("useExpenseDataLoading - Loading data for dashboardId:", dashboardId);
    setIsLoading(true);
    setError(null);
    
    try {
      await db.init();
      setInitAttempted(true);
      
      const [fetchedExpenses, fetchedBudgets] = await Promise.all([
        db.getExpenses(),
        db.getBudgets()
      ]);
      
      console.log(`useExpenseDataLoading - Fetched ${fetchedExpenses.length} expenses and ${fetchedBudgets.length} budgets`);
      
      // Filtrer les dépenses par dashboardId
      const filteredExpenses = fetchedExpenses.filter(expense => {
        // Si on est sur la vue budget (budget route)
        if (dashboardId === "budget") {
          // Inclure les dépenses sans dashboardId ou avec dashboardId default/budget
          const shouldInclude = !expense.dashboardId || 
                 expense.dashboardId === "default" || 
                 expense.dashboardId === "budget";
          return shouldInclude;
        }
        
        // Pour les autres dashboards, ne montrer que les dépenses correspondantes
        // ou les dépenses sans dashboardId si on est sur le dashboard par défaut
        const shouldInclude = expense.dashboardId === dashboardId || 
               (!expense.dashboardId && dashboardId === "default");
        return shouldInclude;
      });
      
      console.log(`useExpenseDataLoading - After dashboard filtering: ${filteredExpenses.length} expenses`);
      
      setExpenses(filteredExpenses);
      setAvailableBudgets(fetchedBudgets);
    } catch (err) {
      console.error("Error loading expense data:", err);
      setError(err instanceof Error ? err : new Error("Failed to load expense data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useExpenseDataLoading - Effect triggered with dashboardId:", dashboardId);
    loadData();
  }, [dashboardId]);

  return {
    expenses,
    availableBudgets,
    isLoading,
    error,
    initAttempted,
    loadData
  };
};
