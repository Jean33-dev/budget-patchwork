
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { Expense } from "@/services/database/models/expense";
import { useExpenseFiltering } from "./useExpenseFiltering";
import { useDatabaseConnection } from "../useDatabaseConnection";

// Cache storage for expenses and budgets
const expenseCache = new Map<string, {
  data: Expense[],
  timestamp: number
}>();
const budgetCache = new Map<string, {
  data: Budget[],
  timestamp: number
}>();

// Cache expiration in ms (10 seconds)
const CACHE_EXPIRY = 10000;

/**
 * Hook for loading expense data with performance optimization
 * @param dashboardId ID of the current dashboard
 */
export const useExpenseDataLoading = (dashboardId: string | null) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);
  const { filterByDashboardId } = useExpenseFiltering();
  const { isInitialized } = useDatabaseConnection();
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Determine the effective dashboardId
  const getEffectiveDashboardId = useCallback(() => {
    return dashboardId || 
      (typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null) || 
      'default';
  }, [dashboardId]);

  const loadData = useCallback(async (forceRefresh = false) => {
    // Skip if database is not initialized
    if (!isInitialized) return;
    
    const effectiveDashboardId = getEffectiveDashboardId();
    if (!effectiveDashboardId) {
      console.error("useExpenseDataLoading: No dashboardId available");
      setIsLoading(false);
      return;
    }
    
    // Store the dashboardId for future operations
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentDashboardId', effectiveDashboardId);
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Check if we have a valid cached data
      const now = Date.now();
      const cachedExpenses = expenseCache.get(effectiveDashboardId);
      const cachedBudgets = budgetCache.get(effectiveDashboardId);
      
      // Use cache if available and not expired
      if (!forceRefresh && 
          cachedExpenses && 
          cachedBudgets && 
          now - cachedExpenses.timestamp < CACHE_EXPIRY && 
          now - cachedBudgets.timestamp < CACHE_EXPIRY) {
        
        setExpenses(cachedExpenses.data);
        setAvailableBudgets(cachedBudgets.data);
        setIsLoading(false);
        setInitAttempted(true);
        return;
      }
      
      // Load budgets
      const loadedBudgets = await db.getBudgets();
      const filteredBudgets = filterByDashboardId(loadedBudgets, effectiveDashboardId);
      
      // Load expenses
      const loadedExpenses = await db.getExpenses();
      const nonRecurringExpenses = loadedExpenses.filter(expense => !expense.isRecurring);
      const filteredExpenses = filterByDashboardId(nonRecurringExpenses, effectiveDashboardId);
      
      // Update cache
      expenseCache.set(effectiveDashboardId, {
        data: filteredExpenses,
        timestamp: now
      });
      budgetCache.set(effectiveDashboardId, {
        data: filteredBudgets,
        timestamp: now
      });
      
      // Update state if component is still mounted
      if (isMounted.current) {
        setAvailableBudgets(filteredBudgets);
        setExpenses(filteredExpenses);
        setInitAttempted(true);
      }
    } catch (error) {
      console.error(`Error loading data for dashboard ${effectiveDashboardId}:`, error);
      if (isMounted.current) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données"
        });
        setError(error instanceof Error ? error : new Error("Failed to load data"));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [isInitialized, dashboardId, toast, filterByDashboardId, getEffectiveDashboardId]);

  // Clean up when unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load data when dashboard changes or database is initialized
  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [loadData, isInitialized, dashboardId]);

  return {
    expenses,
    availableBudgets,
    isLoading,
    error,
    initAttempted,
    loadData: (forceRefresh = true) => loadData(forceRefresh)
  };
};
