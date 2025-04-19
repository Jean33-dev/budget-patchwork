
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/services/database";
import { Expense } from "../models/expense";

export const useExpenseOperationHandlers = (budgetId: string | null, reloadData: () => Promise<void>, dashboardId: string | null) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Gérer l'ajout d'une enveloppe (budget, dépense ou revenu)
  const handleAddEnvelope = async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    setIsProcessing(true);
    try {
      const id = uuidv4();
      
      if (envelope.type === "expense") {
        await db.addExpense({
          id,
          title: envelope.title,
          budget: envelope.budget,
          spent: envelope.budget,
          type: "expense",
          linkedBudgetId: envelope.linkedBudgetId || budgetId || undefined,
          date: envelope.date,
          isRecurring: envelope.isRecurring || false,
          dashboardId: dashboardId || undefined
        });

        toast({
          title: "Dépense ajoutée",
          description: `${envelope.title} a été ajouté avec succès`
        });
      }
      
      await reloadData();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une enveloppe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'enveloppe."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Gérer la suppression d'une dépense
  const handleDeleteExpense = async (id: string) => {
    setIsProcessing(true);
    try {
      await db.deleteExpense(id);
      
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès"
      });
      
      await reloadData();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Gérer la mise à jour d'une dépense
  const handleUpdateExpense = async (expense: Expense) => {
    setIsProcessing(true);
    try {
      await db.updateExpense({
        ...expense,
        dashboardId: dashboardId || expense.dashboardId
      });
      
      toast({
        title: "Dépense mise à jour",
        description: `${expense.title} a été mise à jour avec succès`
      });
      
      await reloadData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense."
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
