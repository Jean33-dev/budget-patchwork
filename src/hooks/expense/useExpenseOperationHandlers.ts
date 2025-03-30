
import { useState, useCallback } from "react";
import { expenseOperations, ExpenseFormData } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";
import { toast } from "@/components/ui/use-toast";

export const useExpenseOperationHandlers = (
  budgetId: string | null,
  setAddDialogOpen: (open: boolean) => void,
  setNeedsReload: (needsReload: boolean) => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddEnvelope = useCallback(async (envelopeData: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }) => {
    if (envelopeData.type !== "expense") {
      return;
    }

    if (isProcessing) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const expenseData: ExpenseFormData = {
        title: envelopeData.title,
        budget: envelopeData.budget,
        type: "expense",
        linkedBudgetId: budgetId || envelopeData.linkedBudgetId,
        date: envelopeData.date || new Date().toISOString().split('T')[0]
      };

      const success = await expenseOperations.addExpense(expenseData);
      
      if (success) {
        setAddDialogOpen(false);
        setNeedsReload(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [budgetId, isProcessing, setAddDialogOpen, setNeedsReload]);

  const handleDeleteExpense = useCallback(async (id: string) => {
    if (!id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de dépense manquant"
      });
      return;
    }

    if (isProcessing) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return;
    }

    setIsProcessing(true);
    console.log(`Suppression de la dépense ${id} commencée`);

    try {
      const success = await expenseOperations.deleteExpense(id);
      
      if (success) {
        console.log(`Suppression de la dépense ${id} réussie`);
        setNeedsReload(true);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la dépense ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, setNeedsReload]);

  const handleUpdateExpense = useCallback(async (updatedExpense: Expense) => {
    if (!updatedExpense?.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Données de dépense invalides"
      });
      return;
    }

    if (isProcessing) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return;
    }

    setIsProcessing(true);
    console.log(`Mise à jour de la dépense ${updatedExpense.id} commencée`);

    try {
      const success = await expenseOperations.updateExpense(updatedExpense);
      
      if (success) {
        console.log(`Mise à jour de la dépense ${updatedExpense.id} réussie`);
        setNeedsReload(true);
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la dépense ${updatedExpense.id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, setNeedsReload]);

  return {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
