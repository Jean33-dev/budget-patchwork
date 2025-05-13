
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";
import { Expense } from "@/services/database/models/expense"; 
import { useExpenseDataLoading } from "./useExpenseDataLoading";
import { useExpenseOperationHandlers } from "./useExpenseOperations";
import { useDataReloader } from "./useDataReloader";
import { useDashboardContext } from "../useDashboardContext";

export type { Budget, Expense };

/**
 * Hook principal pour la gestion des dépenses
 * @param budgetId ID du budget pour filtrer les dépenses (optionnel)
 */
export const useExpenseManagement = (budgetId: string | null) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { currentDashboardId } = useDashboardContext();
  
  // Chargement des données
  const { 
    expenses, 
    availableBudgets, 
    isLoading, 
    error, 
    initAttempted,
    loadData 
  } = useExpenseDataLoading(currentDashboardId);
  
  // Gestionnaires d'opérations
  const { 
    isProcessing, 
    handleAddExpense, 
    handleDeleteExpense, 
    handleUpdateExpense 
  } = useExpenseOperationHandlers(budgetId, loadData, currentDashboardId);

  // Rechargement des données
  const { forceReload } = useDataReloader(isProcessing, isLoading, loadData);

  // Filtrer les dépenses par budgetId si spécifié
  const filteredExpenses = useCallback(() => {
    if (!budgetId) {
      return expenses;
    }
    
    return expenses.filter(expense => expense.linkedBudgetId === budgetId);
  }, [expenses, budgetId]);

  // Calculer les dépenses filtrées une seule fois
  const filteredExpensesResult = filteredExpenses();

  return {
    expenses: filteredExpensesResult,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope: handleAddExpense,
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
