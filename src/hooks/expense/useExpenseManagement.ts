
import { useState } from "react";
import { useExpenseData } from "../useExpenseData";
import { useDataReloader } from "./useDataReloader";
import { useExpenseOperationHandlers } from "./useExpenseOperationHandlers";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

export type { Expense, Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { expenses, availableBudgets, isLoading, error, initAttempted, loadData } = useExpenseData(budgetId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isProcessingState, setIsProcessingState] = useState(false);
  
  // État local pour suivre si un rechargement est nécessaire
  const [needsReloadState, setNeedsReloadState] = useState(false);
  
  // Maintenant nous pouvons utiliser setNeedsReloadState dans les gestionnaires
  const {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  } = useExpenseOperationHandlers(
    budgetId,
    setAddDialogOpen,
    setNeedsReloadState
  );
  
  // Mettre à jour l'état local de isProcessing pour qu'il soit synchronisé
  if (isProcessingState !== isProcessing) {
    setIsProcessingState(isProcessing);
  }
  
  // Utilisez un seul useDataReloader avec les valeurs correctes
  const { forceReload } = useDataReloader({ 
    loadData, 
    isLoading, 
    isProcessing,
    initialNeedsReload: needsReloadState
  });

  return {
    expenses,
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
