
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { Expense } from "@/services/database/models/expense";
import { useExpenseFiltering } from "./useExpenseFiltering";

/**
 * Hook pour charger les données des dépenses
 * @param dashboardId ID du tableau de bord actuel
 */
export const useExpenseDataLoading = (dashboardId: string | null) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);
  const { filterByDashboardId } = useExpenseFiltering();

  const loadData = useCallback(async () => {
    if (!dashboardId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await db.init();
      
      // Chargement des budgets
      const loadedBudgets = await db.getBudgets();
      const filteredBudgets = filterByDashboardId(loadedBudgets, dashboardId);
      setAvailableBudgets(filteredBudgets);
      
      // Chargement des dépenses
      const loadedExpenses = await db.getExpenses();
      const nonRecurringExpenses = loadedExpenses.filter(expense => !expense.isRecurring);
      const filteredExpenses = filterByDashboardId(nonRecurringExpenses, dashboardId);
      setExpenses(filteredExpenses);
      
      setInitAttempted(true);
    } catch (error) {
      console.error(`Erreur lors du chargement des données pour le tableau de bord ${dashboardId}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
      setError(error instanceof Error ? error : new Error("Failed to load data"));
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId, toast, filterByDashboardId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    expenses,
    availableBudgets,
    isLoading,
    error,
    initAttempted,
    loadData
  };
};
