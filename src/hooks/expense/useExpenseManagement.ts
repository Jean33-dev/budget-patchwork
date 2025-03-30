
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
  
  const { 
    needsReload,
    setNeedsReload,
    forceReload
  } = useDataReloader({ 
    loadData, 
    isLoading, 
    isProcessing // Pass the actual isProcessing state here, not hardcoded false
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
