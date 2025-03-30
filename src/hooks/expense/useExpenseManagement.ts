
import { useState, useEffect, useCallback } from "react";
import { db } from "@/services/database";
import { useToast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";
import { useDataReloader } from "./useDataReloader";
import { useExpenseOperationHandlers } from "./useExpenseOperationHandlers";

export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId?: string;
  date: string;
}

export type { Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  // Charger les données
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Initializing database...");
      await db.init();
      
      // Charger les budgets
      const loadedBudgets = await db.getBudgets();
      console.log('Budgets loaded:', loadedBudgets);
      setAvailableBudgets(loadedBudgets);
      
      // Charger les dépenses
      const loadedExpenses = await db.getExpenses();
      console.log('Expenses loaded:', loadedExpenses);
      setExpenses(loadedExpenses);
      
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
  }, [toast]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, [loadData, budgetId]);

  // Gestionnaires d'opérations
  const { 
    isProcessing, 
    handleAddEnvelope, 
    handleDeleteExpense, 
    handleUpdateExpense 
  } = useExpenseOperationHandlers(budgetId, loadData);

  // Rechargement des données
  const { forceReload } = useDataReloader(isProcessing, isLoading, loadData);

  // Obtenir les dépenses filtrées par budgetId
  const filteredExpenses = budgetId 
    ? expenses.filter(expense => expense.linkedBudgetId === budgetId)
    : expenses;

  return {
    expenses: filteredExpenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    loadData,
    forceReload,
    isLoading,
    isProcessing,
    error,
    initAttempted
  };
};
