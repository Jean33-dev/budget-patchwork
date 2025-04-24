
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
      
      if (!dashboardId) {
        console.error("Cannot add expense: No dashboard ID specified");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "ID du tableau de bord manquant"
        });
        return;
      }
      
      // Ensure the dashboardId is always set as a non-empty string
      const currentDashboardId = String(dashboardId);
        
      console.log(`useExpenseOperationHandlers - Adding expense with dashboardId: ${currentDashboardId}`);
      
      const formData: ExpenseFormData = {
        title: envelope.title,
        budget: envelope.budget,
        type: "expense",
        linkedBudgetId: linkedBudgetId,
        date: envelope.date,
        dashboardId: currentDashboardId
      };
      
      const success = await expenseOperations.addExpense(formData);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Dépense ajoutée"
        });
        
        // Reload data to update the UI
        await reloadData();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter la dépense"
        });
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [budgetId, toast, reloadData, dashboardId]);
  
  // Handle updating an expense
  const handleUpdateExpense = useCallback(async (expense: Expense) => {
    console.log("useExpenseOperationHandlers - handleUpdateExpense called with:", expense);
    
    setIsProcessing(true);
    try {
      // Ensure dashboardId is carried forward
      if (dashboardId && !expense.dashboardId) {
        expense.dashboardId = String(dashboardId);
        console.log(`useExpenseOperationHandlers - Setting missing dashboardId to: ${expense.dashboardId}`);
      }
      
      if (!expense.dashboardId) {
        console.error("Cannot update expense: No dashboard ID specified");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "ID du tableau de bord manquant"
        });
        return;
      }
      
      const success = await expenseOperations.updateExpense(expense);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Dépense mise à jour"
        });
        
        // Reload data to update the UI
        await reloadData();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour la dépense"
        });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, reloadData, dashboardId]);
  
  // Handle deleting an expense
  const handleDeleteExpense = useCallback(async (expenseId: string) => {
    console.log(`useExpenseOperationHandlers - handleDeleteExpense called for ID: ${expenseId}`);
    
    setIsProcessing(true);
    try {
      const success = await expenseOperations.deleteExpense(expenseId);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Dépense supprimée"
        });
        
        // Reload data to update the UI
        await reloadData();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer la dépense"
        });
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, reloadData]);

  return {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
