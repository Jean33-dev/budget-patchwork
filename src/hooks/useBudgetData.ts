
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { useDashboardContext } from "./useDashboardContext";

export const useBudgetData = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentDashboardId } = useDashboardContext();
  
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Loading budget data for dashboard:", currentDashboardId);
      
      // Force database initialization
      const dbInitialized = await db.init();
      
      if (!dbInitialized) {
        throw new Error("Failed to initialize database");
      }
      
      console.log("Database initialized, loading budgets...");
      
      // Load budgets
      const allBudgets = await db.getBudgets();
      console.log("All budgets loaded:", allBudgets);
      
      // Filtrer les budgets par dashboardId
      const filteredBudgets = allBudgets.filter(budget => {
        if (currentDashboardId === "budget") {
          // Pour la route spéciale 'budget', inclure les budgets sans dashboardId ou avec dashboardId default/budget
          return !budget.dashboardId || 
                 budget.dashboardId === "default" || 
                 budget.dashboardId === "budget";
        }
        
        // Pour les autres dashboards, ne montrer que les budgets correspondants
        return budget.dashboardId === currentDashboardId;
      });
      
      console.log("Budgets filtered by dashboardId:", filteredBudgets);
      
      // Load expenses
      const expenses = await db.getExpenses();
      console.log("Total expenses loaded:", expenses);
      
      // Filtrer les dépenses par dashboardId
      const filteredExpenses = expenses.filter(expense => {
        if (currentDashboardId === "budget") {
          return !expense.dashboardId || 
                 expense.dashboardId === "default" || 
                 expense.dashboardId === "budget";
        }
        return expense.dashboardId === currentDashboardId;
      });
      
      console.log("Expenses filtered by dashboardId:", filteredExpenses);
      
      // Calculate total expenses
      const totalSpent = filteredExpenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );
      setTotalExpenses(totalSpent);
      
      // Update budgets with their associated expenses
      const validatedBudgets = filteredBudgets.map(budget => {
        const budgetExpenses = filteredExpenses.filter(expense => 
          expense.linkedBudgetId === budget.id
        );
        const budgetSpent = budgetExpenses.reduce((sum, expense) => 
          sum + (Number(expense.budget) || 0), 0
        );
        
        return {
          ...budget,
          budget: Number(budget.budget) || 0,
          spent: budgetSpent,
          carriedOver: budget.carriedOver || 0,
          dashboardId: budget.dashboardId || currentDashboardId // Assurer que dashboardId est défini
        };
      });
      
      setBudgets(validatedBudgets);
      console.log("Budgets updated with expenses:", validatedBudgets);

      // Load and calculate incomes
      const allIncomes = await db.getIncomes();
      
      // Filtrer les revenus par dashboardId
      const filteredIncomes = allIncomes.filter(income => {
        if (currentDashboardId === "budget") {
          return !income.dashboardId || 
                 income.dashboardId === "default" || 
                 income.dashboardId === "budget";
        }
        return income.dashboardId === currentDashboardId;
      });
      
      const totalIncome = filteredIncomes.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      
      setTotalRevenues(totalIncome);
      console.log("Total revenues calculated:", totalIncome);
      
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount or when currentDashboardId changes
  useEffect(() => {
    loadData();
  }, [currentDashboardId]);

  return {
    budgets,
    totalRevenues,
    totalExpenses,
    isLoading,
    error,
    loadData
  };
};
