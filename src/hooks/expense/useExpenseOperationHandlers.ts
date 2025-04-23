
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { expenseOperations, type ExpenseFormData } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";

export const useExpenseOperationHandlers = (
  budgetId: string | null,
  reloadData: () => Promise<void>,
  dashboardId: string | null
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle adding a new expense
  const handleAddEnvelope = useCallback(async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    if (envelope.type !== "expense") return;
    
    console.log("useExpenseOperationHandlers - handleAddEnvelope called with:", envelope);
    console.log("useExpenseOperationHandlers - Current dashboardId:", dashboardId);

    setIsProcessing(true);
    try {
      // Use the passed linkedBudgetId or the default budgetId
      const linkedBudgetId = envelope.linkedBudgetId || budgetId;
      
      if (!linkedBudgetId) {
        console.error("Cannot add expense: No budget specified");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez sélectionner un budget"
        });
        return;
      }

      console.log(`useExpenseOperationHandlers - Adding expense with linkedBudgetId: ${linkedBudgetId}`);
      
      // Ensure the dashboardId is always set as a non-empty string
      const currentDashboardId = dashboardId && dashboardId.trim() !== "" ? 
        String(dashboardId) : "default";
        
      console.log("useExpenseOperationHandlers - Setting expense dashboardId to:", currentDashboardId);
      
      const expenseData: ExpenseFormData = {
        title: envelope.title,
        budget: envelope.budget,
        type: "expense",
        linkedBudgetId: linkedBudgetId,
        date: envelope.date,
        dashboardId: currentDashboardId
      };

      console.log("useExpenseOperationHandlers - Expense data to add:", expenseData);
      
      const success = await expenseOperations.addExpense(expenseData);
      
      if (success) {
        console.log("useExpenseOperationHandlers - Expense added successfully");
        toast({
          title: "Succès",
          description: "La dépense a été ajoutée"
        });
        
        // Refresh data
        await reloadData();
      } else {
        console.error("useExpenseOperationHandlers - Failed to add expense");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter la dépense"
        });
      }
    } catch (error) {
      console.error("useExpenseOperationHandlers - Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [budgetId, dashboardId, reloadData, toast]);

  // Handle deleting an expense
  const handleDeleteExpense = useCallback(async (id: string) => {
    console.log(`useExpenseOperationHandlers - Deleting expense ${id}`);
    
    setIsProcessing(true);
    try {
      const success = await expenseOperations.deleteExpense(id);
      
      if (success) {
        console.log(`useExpenseOperationHandlers - Expense ${id} deleted successfully`);
        toast({
          title: "Succès",
          description: "La dépense a été supprimée"
        });
        
        // Refresh data
        await reloadData();
      } else {
        console.error(`useExpenseOperationHandlers - Failed to delete expense ${id}`);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer la dépense"
        });
      }
    } catch (error) {
      console.error(`useExpenseOperationHandlers - Error deleting expense ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [reloadData, toast]);

  // Handle updating an expense
  const handleUpdateExpense = useCallback(async (expense: Expense) => {
    console.log("useExpenseOperationHandlers - Updating expense:", expense);
    
    setIsProcessing(true);
    try {
      // Ensure the expense has a valid dashboardId
      const currentDashboardId = dashboardId && dashboardId.trim() !== "" ? 
        String(dashboardId) : "default";
        
      const expenseWithDashboard = {
        ...expense,
        dashboardId: currentDashboardId
      };
      
      // Log the expense before and after modification
      console.log("Original expense dashboardId:", expense.dashboardId);
      console.log("Current context dashboardId:", dashboardId);
      console.log("Final expense with dashboardId:", expenseWithDashboard.dashboardId);
      
      const success = await expenseOperations.updateExpense(expenseWithDashboard);
      
      if (success) {
        console.log("useExpenseOperationHandlers - Expense updated successfully");
        toast({
          title: "Succès",
          description: "La dépense a été mise à jour"
        });
        
        // Refresh data
        await reloadData();
      } else {
        console.error("useExpenseOperationHandlers - Failed to update expense");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour la dépense"
        });
      }
    } catch (error) {
      console.error("useExpenseOperationHandlers - Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [dashboardId, reloadData, toast]);

  return {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
