
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { expenseOperations } from "@/utils/expense-operations";
import { Expense } from "../models/expense";
import { useParams } from "react-router-dom";

export const useExpenseOperationHandlers = (
  budgetId: string | null,
  onSuccess: () => void
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();

  const handleAddEnvelope = async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
  }) => {
    setIsProcessing(true);

    try {
      if (envelope.type === "expense") {
        const expenseData = {
          title: envelope.title,
          budget: envelope.budget,
          type: "expense",
          linkedBudgetId: envelope.linkedBudgetId || budgetId || undefined,
          date: envelope.date
        };

        const success = await expenseOperations.addExpense(expenseData, dashboardId);

        if (success) {
          toast({
            title: "Dépense ajoutée",
            description: "La dépense a été ajoutée avec succès."
          });
          onSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'ajouter la dépense."
          });
        }
      }
    } catch (error) {
      console.error("Error adding envelope:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateExpense = async (expense: Expense) => {
    setIsProcessing(true);

    try {
      const success = await expenseOperations.updateExpense(expense, dashboardId);

      if (success) {
        toast({
          title: "Dépense mise à jour",
          description: "La dépense a été mise à jour avec succès."
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour la dépense."
        });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setIsProcessing(true);

    try {
      const success = await expenseOperations.deleteExpense(id);

      if (success) {
        toast({
          title: "Dépense supprimée",
          description: "La dépense a été supprimée avec succès."
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer la dépense."
        });
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression."
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
