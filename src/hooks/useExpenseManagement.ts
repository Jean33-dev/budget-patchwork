
import { useState, useCallback } from "react";
import { useExpenseData } from "./useExpenseData";
import { expenseOperations, ExpenseFormData } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";
import { toast } from "@/components/ui/use-toast";

export type { Expense, Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { expenses, availableBudgets, isLoading, error, initAttempted, loadData } = useExpenseData(budgetId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
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
        // Attendre un peu avant de recharger les données
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la dépense"
      });
    } finally {
      // Petit délai avant de réinitialiser l'état de traitement
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    }
  }, [budgetId, isProcessing, loadData]);

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

    try {
      const success = await expenseOperations.deleteExpense(id);
      
      if (success) {
        // Attendre un peu avant de recharger les données
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadData();
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la dépense ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la dépense"
      });
    } finally {
      // Petit délai avant de réinitialiser l'état de traitement
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    }
  }, [isProcessing, loadData]);

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

    try {
      const success = await expenseOperations.updateExpense(updatedExpense);
      
      if (success) {
        // Attendre un peu avant de recharger les données
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadData();
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la dépense ${updatedExpense.id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la dépense"
      });
    } finally {
      // Petit délai avant de réinitialiser l'état de traitement
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    }
  }, [isProcessing, loadData]);

  return {
    expenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    loadData,
    isLoading,
    isProcessing,
    error,
    initAttempted
  };
};
