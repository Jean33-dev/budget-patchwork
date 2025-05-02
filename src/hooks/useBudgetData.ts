
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
      console.log("Loading budget data for dashboardId:", currentDashboardId);
      
      // Force database initialization
      const dbInitialized = await db.init();
      
      if (!dbInitialized) {
        throw new Error("Failed to initialize database");
      }
      
      console.log("Database initialized, loading budgets...");
      
      // Load budgets
      const allBudgets = await db.getBudgets();
      console.log("All budgets loaded:", allBudgets);
      
      // Filter budgets by dashboardId
      const filteredBudgets = allBudgets.filter(budget => {
        const match = String(budget.dashboardId) === String(currentDashboardId);
        console.log(`Budget ${budget.title} has dashboardId ${budget.dashboardId}, match with current ${currentDashboardId}: ${match}`);
        return match;
      });
      console.log("Filtered budgets by dashboardId:", filteredBudgets);
      
      // Load expenses
      const allExpenses = await db.getExpenses();
      console.log("All expenses loaded:", allExpenses);
      
      // Filter expenses by dashboardId
      const filteredExpenses = allExpenses.filter(expense => {
        const match = String(expense.dashboardId) === String(currentDashboardId);
        console.log(`Expense ${expense.title} has dashboardId ${expense.dashboardId}, match with current ${currentDashboardId}: ${match}`);
        return match;
      });
      console.log("Filtered expenses by dashboardId:", filteredExpenses);
      
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
        
        // Important: If the calculated spent amount differs from the stored spent amount,
        // update the budget in the database to ensure consistency
        if (budgetSpent !== budget.spent) {
          console.log(`Synchronizing budget ${budget.title}: spent in DB (${budget.spent}) ≠ actual expenses (${budgetSpent})`);
          const updatedBudget = {
            ...budget,
            spent: budgetSpent
          };
          db.updateBudget(updatedBudget).catch(err => 
            console.error("Error synchronizing budget spent:", err)
          );
        }
        
        return {
          ...budget,
          budget: Number(budget.budget) || 0,
          spent: budgetSpent, // Use the calculated spent amount
          carriedOver: Number(budget.carriedOver) || 0
        };
      });
      
      setBudgets(validatedBudgets);
      console.log("Budgets updated with expenses:", validatedBudgets);

      // Load and calculate incomes
      const allIncomes = await db.getIncomes();
      console.log("All incomes loaded:", allIncomes);
      
      // Filter incomes by dashboardId
      const filteredIncomes = allIncomes.filter(income => {
        const match = String(income.dashboardId) === String(currentDashboardId);
        console.log(`Income ${income.title} has dashboardId ${income.dashboardId}, match with current ${currentDashboardId}: ${match}`);
        return match;
      });
      console.log("Filtered incomes by dashboardId:", filteredIncomes);
      
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

  // Load data on component mount or when dashboardId changes
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
