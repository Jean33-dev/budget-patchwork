
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";

export const useBudgetData = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Loading budget data...");
      
      // Force database initialization
      const dbInitialized = await db.init();
      
      if (!dbInitialized) {
        console.error("Failed to initialize database in useBudgetData");
        throw new Error("Failed to initialize database");
      }
      
      console.log("Database initialized, loading budgets...");
      
      // Load budgets
      const budgetsData = await db.getBudgets();
      console.log("Budgets loaded:", budgetsData);
      
      // Load expenses
      const expenses = await db.getExpenses();
      console.log("Total expenses loaded:", expenses);
      
      // Calculate total expenses
      const totalSpent = expenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );
      setTotalExpenses(totalSpent);
      console.log("Total expenses calculated:", totalSpent);
      
      // Update budgets with their associated expenses
      const validatedBudgets = budgetsData.map(budget => {
        const budgetExpenses = expenses.filter(expense => 
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
      const incomesData = await db.getIncomes();
      console.log("Total incomes loaded:", incomesData);
      const totalIncome = incomesData.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      
      setTotalRevenues(totalIncome);
      console.log("Total revenues calculated:", totalIncome);
      
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

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  return {
    budgets,
    totalRevenues,
    totalExpenses,
    isLoading,
    error,
    loadData
  };
};
