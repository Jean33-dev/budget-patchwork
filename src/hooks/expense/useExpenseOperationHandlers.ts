
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { expenseOperations } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";

export const useExpenseOperationHandlers = (
  budgetId: string | null,
  loadData: () => Promise<void>,
  dashboardId: string
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddEnvelope = async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
  }) => {
    if (envelope.type !== "expense") {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Type d'enveloppe invalide"
      });
      return;
    }

    if (!envelope.linkedBudgetId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un budget"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log("useExpenseOperationHandlers - Adding new expense with dashboardId:", dashboardId);
      
      // Utiliser le bon dashboardId en fonction du contexte
      const dashboardToUse = dashboardId === "budget" ? "default" : dashboardId;
      
      const success = await expenseOperations.addExpense({
        title: envelope.title,
        budget: envelope.budget,
        type: "expense",
        linkedBudgetId: envelope.linkedBudgetId,
        date: envelope.date,
        dashboardId: dashboardToUse
      });

      if (success) {
        toast({
          title: "Succès",
          description: "Dépense ajoutée avec succès"
        });
        await loadData();
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
        description: "Une erreur s'est produite lors de l'ajout de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setIsProcessing(true);
    try {
      console.log("useExpenseOperationHandlers - Deleting expense:", id);
      const success = await expenseOperations.deleteExpense(id);

      if (success) {
        toast({
          title: "Succès",
          description: "Dépense supprimée avec succès"
        });
        await loadData();
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
        description: "Une erreur s'est produite lors de la suppression de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    setIsProcessing(true);
    try {
      console.log("useExpenseOperationHandlers - Updating expense with dashboardId:", updatedExpense.dashboardId);
      
      // Préserver le dashboardId existant ou utiliser celui du contexte actuel
      if (!updatedExpense.dashboardId) {
        const dashboardToUse = dashboardId === "budget" ? "default" : dashboardId;
        updatedExpense.dashboardId = dashboardToUse;
      }
      
      const success = await expenseOperations.updateExpense(updatedExpense);

      if (success) {
        toast({
          title: "Succès",
          description: "Dépense mise à jour avec succès"
        });
        await loadData();
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
        description: "Une erreur s'est produite lors de la mise à jour de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
