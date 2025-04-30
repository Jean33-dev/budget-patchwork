
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { expenseOperations, type ExpenseFormData } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";

/**
 * Hook pour gérer les opérations sur les dépenses
 */
export const useExpenseOperationHandlers = (
  budgetId: string | null,
  reloadData: () => Promise<void>,
  dashboardId: string | null
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Gère l'ajout d'une nouvelle dépense
   */
  const handleAddExpense = useCallback(async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    if (envelope.type !== "expense") return;
    
    setIsProcessing(true);
    try {
      // Utiliser le linkedBudgetId passé ou le budgetId par défaut
      const linkedBudgetId = envelope.linkedBudgetId || budgetId;
      
      if (!linkedBudgetId) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez sélectionner un budget"
        });
        return;
      }

      if (!dashboardId) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "ID du tableau de bord manquant"
        });
        return;
      }
      
      // S'assurer que le dashboardId est toujours défini comme une chaîne non vide
      const currentDashboardId = String(dashboardId);
      
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
  
  /**
   * Gère la mise à jour d'une dépense existante
   */
  const handleUpdateExpense = useCallback(async (expense: Expense) => {
    setIsProcessing(true);
    try {
      // S'assurer que dashboardId est toujours présent
      if (!expense.dashboardId && dashboardId) {
        expense.dashboardId = String(dashboardId);
      }
      
      if (!expense.dashboardId) {
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
  
  /**
   * Gère la suppression d'une dépense
   */
  const handleDeleteExpense = useCallback(async (expenseId: string) => {
    setIsProcessing(true);
    try {
      const success = await expenseOperations.deleteExpense(expenseId);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Dépense supprimée"
        });
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
    handleAddExpense,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
