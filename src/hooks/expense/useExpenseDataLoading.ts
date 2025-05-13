
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
    // Obtenir le dashboardId depuis les paramètres ou le localStorage
    const effectiveDashboardId = dashboardId || 
      (typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null);
    
    if (!effectiveDashboardId) {
      console.error("useExpenseDataLoading: Aucun dashboardId disponible");
      setIsLoading(false);
      return;
    } else {
      console.log(`useExpenseDataLoading: Utilisation du dashboardId "${effectiveDashboardId}"`);
      // Stocker le dashboardId pour les futures opérations
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentDashboardId', effectiveDashboardId);
        console.log(`useExpenseDataLoading: dashboardId "${effectiveDashboardId}" stocké dans localStorage`);
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`useExpenseDataLoading: Initialisation de la base de données pour le dashboardId "${effectiveDashboardId}"`);
      await db.init();
      
      // Chargement des budgets
      console.log("useExpenseDataLoading: Chargement des budgets");
      const loadedBudgets = await db.getBudgets();
      console.log(`useExpenseDataLoading: ${loadedBudgets.length} budgets chargés`);
      
      // Filtrage des budgets par dashboardId avec logging détaillé
      console.log(`useExpenseDataLoading: Filtrage des budgets pour dashboardId "${effectiveDashboardId}"`);
      const filteredBudgets = filterByDashboardId(loadedBudgets, effectiveDashboardId);
      console.log(`useExpenseDataLoading: ${filteredBudgets.length} budgets après filtrage`);
      setAvailableBudgets(filteredBudgets);
      
      // Chargement des dépenses
      console.log("useExpenseDataLoading: Chargement des dépenses");
      const loadedExpenses = await db.getExpenses();
      console.log(`useExpenseDataLoading: ${loadedExpenses.length} dépenses chargées`);
      
      // Log des dashboardIds des dépenses chargées
      const dashboardIds = loadedExpenses.map(expense => `${expense.id}: "${expense.dashboardId}"`);
      console.log("useExpenseDataLoading: dashboardIds des dépenses chargées:", dashboardIds);
      
      const nonRecurringExpenses = loadedExpenses.filter(expense => !expense.isRecurring);
      console.log(`useExpenseDataLoading: ${nonRecurringExpenses.length} dépenses non récurrentes`);
      
      // Filtrage des dépenses par dashboardId
      console.log(`useExpenseDataLoading: Filtrage des dépenses pour dashboardId "${effectiveDashboardId}"`);
      const filteredExpenses = filterByDashboardId(nonRecurringExpenses, effectiveDashboardId);
      console.log(`useExpenseDataLoading: ${filteredExpenses.length} dépenses après filtrage`);
      setExpenses(filteredExpenses);
      
      setInitAttempted(true);
    } catch (error) {
      console.error(`Erreur lors du chargement des données pour le tableau de bord ${effectiveDashboardId}:`, error);
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
