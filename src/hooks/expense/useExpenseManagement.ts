
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
  
  // First initialize the data reloader to get setNeedsReload
  const { 
    needsReload,
    setNeedsReload,
    forceReload
  } = useDataReloader({ 
    loadData, 
    isLoading,
    isProcessing: false // Initial value, will be updated in the effect
  });
  
  // Now we can use setNeedsReload in the handlers
  const {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  } = useExpenseOperationHandlers(
    budgetId,
    setAddDialogOpen,
    setNeedsReload
  );
  
  // Update the data reloader with the correct isProcessing state
  useDataReloader({ 
    loadData, 
    isLoading, 
    isProcessing 
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
