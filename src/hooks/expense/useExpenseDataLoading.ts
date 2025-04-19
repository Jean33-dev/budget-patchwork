
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
    console.log(`useExpenseDataLoading - Beginning data load for dashboard: ${useDashboardId}`);
    
    setIsLoading(true);
    setError(null);
    
    try {
      await db.init();
      
      // Load budgets
      console.log("useExpenseDataLoading - Loading budgets");
      const loadedBudgets = await db.getBudgets();
      console.log(`useExpenseDataLoading - All budgets loaded from database (${loadedBudgets.length}):`, loadedBudgets);
      
      const filteredBudgets = loadedBudgets.filter(b => 
        !b.dashboardId || b.dashboardId === useDashboardId
      );
      console.log(`useExpenseDataLoading - Filtered budgets for dashboard ${useDashboardId}:`, filteredBudgets);
      setAvailableBudgets(filteredBudgets);
      
      // Load expenses
      console.log("useExpenseDataLoading - Loading expenses");
      const loadedExpenses = await db.getExpenses();
      console.log(`useExpenseDataLoading - All expenses loaded from database (${loadedExpenses.length}):`, loadedExpenses);
      
      // Filtrer les dépenses qui ne sont pas récurrentes
      const nonRecurringExpenses = loadedExpenses.filter(expense => !expense.isRecurring);
      console.log(`useExpenseDataLoading - Non-recurring expenses (${nonRecurringExpenses.length}):`, nonRecurringExpenses);
      
      // Simplifier la logique de filtrage par dashboardId
      const filteredExpenses = nonRecurringExpenses.filter(expense => {
        // Si le dashboardId demandé est "budget", traiter comme un cas spécial
        if (useDashboardId === "budget") {
          // Pour "budget", montrer toutes les dépenses sans dashboardId ou avec dashboardId="default"
          return !expense.dashboardId || expense.dashboardId === "default" || expense.dashboardId === "budget";
        }
        
        // Sinon, montrer uniquement les dépenses qui correspondent au dashboardId demandé
        // ou les dépenses sans dashboardId si on est sur le dashboard par défaut
        return expense.dashboardId === useDashboardId || 
               (!expense.dashboardId && useDashboardId === "default");
      });
      
      console.log(`useExpenseDataLoading - Filtered expenses for dashboard ${useDashboardId} (${filteredExpenses.length}):`, filteredExpenses);
      setExpenses(filteredExpenses);
      
      setInitAttempted(true);
    } catch (error) {
      console.error(`useExpenseDataLoading - Error loading data for dashboard ${useDashboardId}:`, error);
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
    console.log(`useExpenseDataLoading - Effect triggered with dashboardId: ${dashboardId}`);
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
