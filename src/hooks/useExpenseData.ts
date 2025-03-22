
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

export const useExpenseData = (budgetId: string | null) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadBudgets = useCallback(async () => {
    try {
      // Load budgets
      const loadedBudgets = await db.getBudgets();
      console.log('Budgets loaded:', loadedBudgets);
      
      if (!loadedBudgets || loadedBudgets.length === 0) {
        // Create default budgets if none exist
        const defaultBudgets: Budget[] = [
          {
            id: "budget1",
            title: "Budget Test 1",
            budget: 1000,
            spent: 0,
            type: "budget"
          },
          {
            id: "budget2",
            title: "Budget Test 2",
            budget: 2000,
            spent: 0,
            type: "budget"
          }
        ];

        for (const budget of defaultBudgets) {
          await db.addBudget(budget);
        }

        setAvailableBudgets(defaultBudgets);
      } else {
        setAvailableBudgets(loadedBudgets);
      }
      
      return true;
    } catch (error) {
      console.error("Error loading budgets:", error);
      setError(error instanceof Error ? error : new Error("Failed to load budgets"));
      return false;
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    try {
      // Load expenses
      const loadedExpenses = await db.getExpenses();
      console.log('Expenses loaded:', loadedExpenses);
      setExpenses(loadedExpenses);
      return true;
    } catch (error) {
      console.error("Error loading expenses:", error);
      setError(error instanceof Error ? error : new Error("Failed to load expenses"));
      return false;
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const budgetsLoaded = await loadBudgets();
      const expensesLoaded = await loadExpenses();
      
      if (!budgetsLoaded || !expensesLoaded) {
        throw new Error("Failed to load data");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadBudgets, loadExpenses]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [budgetId, loadData]);

  // Get filtered expenses based on budgetId
  const filteredExpenses = budgetId 
    ? expenses.filter(expense => expense.linkedBudgetId === budgetId)
    : expenses;

  return {
    expenses: filteredExpenses,
    availableBudgets,
    isLoading,
    error,
    loadData
  };
};
