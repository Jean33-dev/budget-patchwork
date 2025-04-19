
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLoadAttempt(prev => prev + 1);
    
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
      const validatedBudgets = dashboardBudgets.map(budget => {
        const budgetExpenses = dashboardExpenses.filter(expense => 
          expense.linkedBudgetId === budget.id
        );
        console.log(`Expenses for budget ${budget.id} (${budget.title}):`, budgetExpenses);
        
        const budgetSpent = budgetExpenses.reduce((sum, expense) => 
          sum + (Number(expense.budget) || 0), 0
        );
        
        return {
          ...budget,
          budget: Number(budget.budget) || 0,
          spent: budgetSpent,
          carriedOver: budget.carriedOver || 0
        };
      });
      
      setBudgets(validatedBudgets);
      console.log("Budgets updated with expenses:", validatedBudgets);

      // Load and calculate incomes
      const allIncomes = await db.getIncomes();
      console.log("All incomes loaded:", allIncomes);
      
      // Filter incomes by dashboardId
      const dashboardIncomes = allIncomes.filter(income => 
        income.dashboardId === dashboardId || !income.dashboardId
      );
      console.log(`Filtered incomes for dashboard ${dashboardId}:`, dashboardIncomes);
      
      const totalIncome = dashboardIncomes.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      
      setTotalRevenues(totalIncome);
      console.log(`Total revenues calculated for dashboard ${dashboardId}:`, totalIncome);
      
    } catch (error) {
      console.error(`Error loading budget data (attempt ${loadAttempt}):`, error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
      if (loadAttempt < 3) {
        // Auto-retry once on failure with a delay
        const retryDelay = Math.pow(2, loadAttempt) * 1000; // Exponential backoff
        console.log(`Will auto-retry in ${retryDelay}ms...`);
        setTimeout(() => loadData(), retryDelay);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données budgétaires"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId, loadAttempt, toast]);

  // Load data on component mount or when dashboardId changes
  useEffect(() => {
    console.log(`useBudgetData effect triggered, loading data for dashboard ${dashboardId}`);
    loadData();
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
