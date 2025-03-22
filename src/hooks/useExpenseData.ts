
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

export const useExpenseData = (budgetId: string | null) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
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
      
      // Load expenses
      const loadedExpenses = await db.getExpenses();
      console.log('Expenses loaded:', loadedExpenses);
      setExpenses(loadedExpenses);
      
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
  }, []);

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
    loadData
  };
};
