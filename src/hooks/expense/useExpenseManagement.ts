
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";
import { Expense } from "../models/expense"; 
import { useExpenseDataLoading } from "./useExpenseDataLoading";
import { useExpenseOperationHandlers } from "./useExpenseOperationHandlers";
import { useDataReloader } from "./useDataReloader";

export type { Budget, Expense };

export const useExpenseManagement = (budgetId: string | null) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Load expense data
  const { 
    expenses, 
    availableBudgets, 
    isLoading, 
    error, 
    initAttempted,
    loadData 
  } = useExpenseDataLoading();

  // Operation handlers
  const { 
    isProcessing, 
    handleAddEnvelope, 
    handleDeleteExpense, 
    handleUpdateExpense 
  } = useExpenseOperationHandlers(budgetId, loadData);

  // Data reloading
  const { forceReload } = useDataReloader(isProcessing, isLoading, loadData);

  // Filter expenses by budgetId
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
