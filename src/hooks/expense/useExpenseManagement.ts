
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";
import { Expense } from "../models/expense"; 
import { useExpenseDataLoading } from "./useExpenseDataLoading";
import { useExpenseOperationHandlers } from "./useExpenseOperationHandlers";
import { useDataReloader } from "./useDataReloader";
import { useDashboardContext } from "../useDashboardContext";

export type { Budget, Expense };

export const useExpenseManagement = (budgetId: string | null) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { currentDashboardId } = useDashboardContext();

  // Load expense data
  const { 
    expenses, 
    availableBudgets, 
    isLoading, 
    error, 
    initAttempted,
    loadData 
  } = useExpenseDataLoading(currentDashboardId);

  // Operation handlers with dashboard context
  const { 
    isProcessing, 
    handleAddEnvelope, 
    handleDeleteExpense, 
    handleUpdateExpense 
  } = useExpenseOperationHandlers(budgetId, loadData, currentDashboardId);

  // Data reloading
  const { forceReload } = useDataReloader(isProcessing, isLoading, loadData);

  // Filter expenses by budgetId and current dashboard
  const filteredExpenses = useCallback(() => {
    return expenses.filter(expense => {
      const matchesBudget = budgetId ? expense.linkedBudgetId === budgetId : true;
      const matchesDashboard = expense.dashboardId === currentDashboardId;
      return matchesBudget && matchesDashboard;
    });
  }, [expenses, budgetId, currentDashboardId]);

  return {
    expenses: filteredExpenses(),
    availableBudgets: availableBudgets.filter(b => b.dashboardId === currentDashboardId),
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
