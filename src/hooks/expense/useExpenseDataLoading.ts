
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Budget } from "@/types/categories";
import { Expense } from "../models/expense";
import { useParams } from "react-router-dom";

export const useExpenseDataLoading = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();

  // Load data function
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading data for dashboard ${dashboardId}...`);
      await db.init();
      
      // Load budgets
      const allBudgets = await db.getBudgets();
      console.log('All budgets loaded:', allBudgets);
      
      // Filter budgets by dashboardId
      const filteredBudgets = allBudgets.filter(budget => 
        budget.dashboardId === dashboardId || !budget.dashboardId
      );
      console.log(`Filtered budgets for dashboard ${dashboardId}:`, filteredBudgets);
      
      setAvailableBudgets(filteredBudgets);
      
      // Load expenses
      const allExpenses = await db.getExpenses();
      console.log('All expenses loaded:', allExpenses);
      
      // Filter expenses by dashboardId
      const filteredExpenses = allExpenses.filter(expense => 
        expense.dashboardId === dashboardId || !expense.dashboardId
      );
      console.log(`Filtered expenses for dashboard ${dashboardId}:`, filteredExpenses);
      
      setExpenses(filteredExpenses);
      
      setInitAttempted(true);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
      setError(error instanceof Error ? error : new Error("Failed to load data"));
    } finally {
      setIsLoading(false);
    }
  }, [toast, dashboardId]);

  // Load data on component mount or when dashboardId changes
  useEffect(() => {
    loadData();
  }, [loadData, dashboardId]);

  return {
    expenses,
    availableBudgets,
    isLoading,
    error,
    initAttempted,
    loadData
  };
};
