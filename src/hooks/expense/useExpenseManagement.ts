
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";
import { Expense } from "@/services/database/models/expense"; 
import { useExpenseDataLoading } from "./useExpenseDataLoading";
import { useExpenseOperationHandlers } from "./useExpenseOperationHandlers";
import { useDataReloader } from "./useDataReloader";
import { useDashboardContext } from "../useDashboardContext";

export type { Budget, Expense };

export const useExpenseManagement = (budgetId: string | null) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { currentDashboardId } = useDashboardContext();
  
  console.log("useExpenseManagement - initialized with budgetId:", budgetId, "currentDashboardId:", currentDashboardId);

  // Load expense data
  const { 
    expenses, 
    availableBudgets, 
    isLoading, 
    error, 
    initAttempted,
    loadData 
  } = useExpenseDataLoading(currentDashboardId);
  
  console.log("useExpenseManagement - loaded expenses count:", expenses.length);
  console.log("useExpenseManagement - expense sample:", expenses.slice(0, 2));

  // Operation handlers with dashboard context
  const { 
    isProcessing, 
    handleAddEnvelope, 
    handleDeleteExpense, 
    handleUpdateExpense 
  } = useExpenseOperationHandlers(budgetId, loadData, currentDashboardId);

  // Data reloading
  const { forceReload } = useDataReloader(isProcessing, isLoading, loadData);

  // Filter expenses by budgetId and dashboardId
  const filteredExpenses = useCallback(() => {
    console.log("useExpenseManagement - Filtering expenses. Total:", expenses.length, "budgetId:", budgetId, "dashboardId:", currentDashboardId);
    
    // Premier niveau de filtrage par dashboard
    const dashboardFiltered = expenses.filter(expense => {
      // Si on est sur la vue budget (budget route)
      if (currentDashboardId === "budget") {
        // Inclure les dépenses sans dashboardId ou avec dashboardId default/budget
        return !expense.dashboardId || 
               expense.dashboardId === "default" || 
               expense.dashboardId === "budget";
      }
      
      // Pour les autres dashboards, ne montrer que les dépenses correspondantes
      // ou les dépenses sans dashboardId si on est sur le dashboard par défaut
      return expense.dashboardId === currentDashboardId || 
             (!expense.dashboardId && currentDashboardId === "default");
    });
    
    console.log(`useExpenseManagement - After dashboard filtering: ${dashboardFiltered.length} expenses`);
    
    // Deuxième niveau de filtrage par budget si un budgetId est spécifié
    if (!budgetId) {
      console.log("useExpenseManagement - No budgetId filter, returning dashboard filtered expenses");
      return dashboardFiltered;
    }
    
    const filtered = dashboardFiltered.filter(expense => expense.linkedBudgetId === budgetId);
    console.log(`useExpenseManagement - Filtered by budgetId ${budgetId}, returning ${filtered.length} expenses`);
    return filtered;
  }, [expenses, budgetId, currentDashboardId]);

  // Calculer les dépenses filtrées une seule fois et les stocker
  const filteredExpensesResult = filteredExpenses();

  return {
    expenses: filteredExpensesResult,
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
