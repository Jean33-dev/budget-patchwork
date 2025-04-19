
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
    if (!dashboardId) {
      console.warn("No dashboard ID provided, skipping data load");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading data for dashboard: ${dashboardId}`);
      await db.init();
      
      // Load budgets
      const loadedBudgets = await db.getBudgets();
      const filteredBudgets = loadedBudgets.filter(b => 
        !b.dashboardId || b.dashboardId === dashboardId
      );
      console.log(`Dashboard ${dashboardId} - Budgets:`, filteredBudgets);
      setAvailableBudgets(filteredBudgets);
      
      // Load expenses
      const loadedExpenses = await db.getExpenses();
      const filteredExpenses = loadedExpenses.filter(e => 
        !e.dashboardId || e.dashboardId === dashboardId
      );
      console.log(`Dashboard ${dashboardId} - Expenses:`, filteredExpenses);
      setExpenses(filteredExpenses);
      
      setInitAttempted(true);
    } catch (error) {
      console.error(`Error loading data for dashboard ${dashboardId}:`, error);
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
