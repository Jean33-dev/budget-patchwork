
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
      setIsProcessing(false);
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

    try {
      setIsProcessing(true);
      console.log(`Demande de suppression de la dépense avec l'ID: ${id}`);
      const success = await expenseOperations.deleteExpense(id);
      
      if (success) {
        console.log(`Dépense ${id} supprimée avec succès`);
        await loadData();
      } else {
        console.warn(`Échec de la suppression de la dépense ${id}`);
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
  }, [isProcessing, loadData]);

  const handleUpdateExpense = useCallback(async (updatedExpense: Expense) => {
    if (!updatedExpense || !updatedExpense.id) {
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

    try {
      setIsProcessing(true);
      console.log(`Demande de mise à jour de la dépense avec l'ID: ${updatedExpense.id}`);
      const success = await expenseOperations.updateExpense(updatedExpense);
      
      if (success) {
        console.log(`Dépense ${updatedExpense.id} mise à jour avec succès`);
        await loadData();
      } else {
        console.warn(`Échec de la mise à jour de la dépense ${updatedExpense.id}`);
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
