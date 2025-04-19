
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { useParams } from "react-router-dom";

export const useBudgetData = () => {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();
  const isLoadingRef = useRef(false);

  const loadData = useCallback(async () => {
    // Prevent concurrent loads
    if (isLoadingRef.current) {
      console.log("Already loading data, skipping duplicate request");
      return;
    }
    
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading budget data for dashboard ${dashboardId}... (attempt ${loadAttempt + 1})`);
      
      // Force database initialization
      const dbInitialized = await db.init();
      
      if (!dbInitialized) {
        console.error(`Failed to initialize database in useBudgetData (attempt ${loadAttempt + 1})`);
        throw new Error("Failed to initialize database");
      }
      
      console.log("Database initialized, loading budgets...");
      
      // Load budgets
      const allBudgets = await db.getBudgets();
      console.log("All budgets loaded:", allBudgets);
      
      // Filter budgets by dashboardId
      const dashboardBudgets = allBudgets.filter(budget => 
        budget.dashboardId === dashboardId || !budget.dashboardId
      );
      console.log(`Filtered budgets for dashboard ${dashboardId}:`, dashboardBudgets);
      
      // Load expenses to calculate totals
      const allExpenses = await db.getExpenses();
      console.log("All expenses loaded:", allExpenses);
      
      // Filter expenses by dashboardId
      const dashboardExpenses = allExpenses.filter(expense => 
        expense.dashboardId === dashboardId || !expense.dashboardId
      );
      console.log(`Filtered expenses for dashboard ${dashboardId}:`, dashboardExpenses);
      
      // Calculate total expenses
      const totalSpent = dashboardExpenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );
      setTotalExpenses(totalSpent);
      console.log(`Total expenses calculated for dashboard ${dashboardId}:`, totalSpent);
      
      // Update budgets with their associated expenses
      const budgetsWithSpent = dashboardBudgets.map(budget => {
        const budgetExpenses = dashboardExpenses.filter(expense => 
          expense.linkedBudgetId === budget.id
        );
        const spent = budgetExpenses.reduce((sum, expense) => 
          sum + (Number(expense.budget) || 0), 0
        );
        
        return {
          ...budget,
          spent
        };
      });
      
      setBudgets(budgetsWithSpent);
      
      // Load incomes to calculate total revenues
      const allIncomes = await db.getIncomes();
      const dashboardIncomes = allIncomes.filter(income => 
        income.dashboardId === dashboardId || !income.dashboardId
      );
      
      const totalIncome = dashboardIncomes.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      setTotalRevenues(totalIncome);
      
      setLoadAttempt(prev => prev + 1);
    } catch (err) {
      console.error("Error loading budget data:", err);
      setError(err instanceof Error ? err : new Error("Error loading data"));
      
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les données budgétaires."
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [dashboardId, loadAttempt, toast]);

  // Only load data once on mount or when dashboardId changes
  useEffect(() => {
    console.log("useBudgetData effect triggered, loading data for dashboard", dashboardId);
    loadData();
    // Only re-run when dashboardId changes, not on every loadAttempt
  }, [dashboardId, loadData]);

  return {
    budgets,
    totalRevenues,
    totalExpenses,
    isLoading,
    error,
    loadData
  };
};
