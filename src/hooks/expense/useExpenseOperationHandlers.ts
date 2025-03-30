
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Expense } from "../useExpenseManagement";

export const useExpenseOperationHandlers = (
  budgetId: string | null,
  loadData: () => Promise<void>
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Ajouter une dépense
  const handleAddEnvelope = useCallback(async (envelopeData: {
    title: string;
    budget: number;
    type: "expense";
    linkedBudgetId?: string;
    date: string;
  }) => {
    if (isProcessing) {
      toast({
        title: "Opération en cours",
        description: "Une opération est déjà en cours"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: envelopeData.title || "Sans titre",
        budget: envelopeData.budget || 0,
        spent: envelopeData.budget || 0,
        type: "expense",
        linkedBudgetId: budgetId || envelopeData.linkedBudgetId,
        date: envelopeData.date || new Date().toISOString().split('T')[0]
      };

      await db.addExpense(newExpense);
      
      toast({
        title: "Succès",
        description: "Dépense ajoutée avec succès"
      });
      
      await loadData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [budgetId, isProcessing, loadData, toast]);

  // Supprimer une dépense
  const handleDeleteExpense = useCallback(async (id: string) => {
    if (isProcessing) {
      toast({
        title: "Opération en cours",
        description: "Une opération est déjà en cours"
      });
      return;
    }

    try {
      setIsProcessing(true);
      await db.deleteExpense(id);
      
      toast({
        title: "Succès",
        description: "Dépense supprimée avec succès"
      });
      
      await loadData();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, loadData, toast]);

  // Mettre à jour une dépense
  const handleUpdateExpense = useCallback(async (expense: Expense) => {
    if (isProcessing) {
      toast({
        title: "Opération en cours",
        description: "Une opération est déjà en cours"
      });
      return;
    }

    try {
      setIsProcessing(true);
      await db.updateExpense(expense);
      
      toast({
        title: "Succès",
        description: "Dépense mise à jour avec succès"
      });
      
      await loadData();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, loadData, toast]);

  return {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
