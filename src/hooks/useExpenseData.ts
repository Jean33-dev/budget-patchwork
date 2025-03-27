
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

export const useExpenseData = (budgetId: string | null) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state true
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

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
      console.log("Initializing database before loading data...");
      // Explicitly initialize the database with multiple retries
      let dbInitialized = false;
      
      // Try up to 5 times to initialize the database
      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`Database initialization attempt ${attempt}...`);
        try {
          dbInitialized = await db.init();
          if (dbInitialized) {
            console.log(`Database successfully initialized on attempt ${attempt}`);
            break;
          }
        } catch (error) {
          console.error(`Error during initialization attempt ${attempt}:`, error);
        }
        
        if (attempt < 5) {
          // Wait before retrying with increasing delay
          const delay = Math.min(1000 * attempt, 5000);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      if (!dbInitialized) {
        throw new Error("Failed to initialize database after multiple attempts");
      }
      
      // Essayer de charger les budgets d'abord, car ils sont nécessaires pour les dépenses
      console.log("Loading budgets...");
      const budgetsLoaded = await loadBudgets();
      if (!budgetsLoaded) {
        console.error("Failed to load budgets, retrying...");
        // Retenter une fois
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retryBudgets = await loadBudgets();
        if (!retryBudgets) {
          throw new Error("Failed to load budgets after retry");
        }
      }
      
      console.log("Loading expenses...");
      const expensesLoaded = await loadExpenses();
      if (!expensesLoaded) {
        console.error("Failed to load expenses, retrying...");
        // Retenter une fois
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retryExpenses = await loadExpenses();
        if (!retryExpenses) {
          throw new Error("Failed to load expenses after retry");
        }
      }
      
      setInitAttempted(true);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données. Veuillez rafraîchir la page."
      });
      setError(error instanceof Error ? error : new Error("Failed to load data"));
    } finally {
      setIsLoading(false);
    }
  }, [loadBudgets, loadExpenses]);

  // Load data on component mount
  useEffect(() => {
    console.log("useExpenseData: Loading data on mount");
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
    loadData,
    initAttempted
  };
};
