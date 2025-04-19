
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { useParams } from "react-router-dom";

export const useBudgetData = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading budget data for dashboard ${dashboardId}...`);
      
      // Force database initialization
      const dbInitialized = await db.init();
      
      if (!dbInitialized) {
        console.error("Failed to initialize database in useBudgetData");
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
      
      // Load expenses
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
      console.error("Error loading data:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount or when dashboardId changes
  useEffect(() => {
    loadData();
  }, [dashboardId]);

  return {
    budgets,
    totalRevenues,
    totalExpenses,
    isLoading,
    error,
    loadData
  };
};
