
import { useState, useEffect } from "react";
import { useExpenseData } from "../useExpenseData";
import { useDataReloader } from "./useDataReloader";
import { useExpenseOperationHandlers } from "./useExpenseOperationHandlers";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

export type { Expense, Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { expenses, availableBudgets, isLoading, error, initAttempted, loadData } = useExpenseData(budgetId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // État local pour suivre si un rechargement est nécessaire
  const [needsReloadState, setNeedsReloadState] = useState(false);
  
  // Utiliser les gestionnaires d'opérations avec la mise à jour correcte
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
  
  // Utilisez useDataReloader avec les valeurs correctes
  const { forceReload } = useDataReloader({ 
    loadData, 
    isLoading, 
    isProcessing, // Utiliser directement isProcessing du handler
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
    isProcessing, // Retourner directement isProcessing du handler
    error,
    initAttempted
  };
};
