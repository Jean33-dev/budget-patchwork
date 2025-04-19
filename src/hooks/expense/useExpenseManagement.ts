
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
    console.log("Filtering expenses. Total:", expenses.length, "budgetId:", budgetId, "dashboardId:", currentDashboardId);
    
    return expenses.filter(expense => {
      const matchesBudget = budgetId ? expense.linkedBudgetId === budgetId : true;
      
      // Afficher les dépenses sans dashboardId ou celles qui correspondent au dashboard actuel
      const matchesDashboard = !expense.dashboardId || expense.dashboardId === currentDashboardId;
      
      const shouldInclude = matchesBudget && matchesDashboard;
      if (!shouldInclude) {
        console.log("Filtering out expense:", expense.title, "linkedBudgetId:", expense.linkedBudgetId, "dashboardId:", expense.dashboardId);
      }
      
      return shouldInclude;
    });
  }, [expenses, budgetId, currentDashboardId]);

  // Calculer les dépenses filtrées une seule fois et les stocker
  const filteredExpensesResult = filteredExpenses();
  console.log("Filtered expenses result count:", filteredExpensesResult.length);

  return {
    expenses: filteredExpensesResult,
    availableBudgets: availableBudgets.filter(b => !b.dashboardId || b.dashboardId === currentDashboardId),
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
