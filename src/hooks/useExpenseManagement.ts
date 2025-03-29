
import { useState, useCallback, useRef } from "react";
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
  const operationTimeoutRef = useRef<number | null>(null);

  // Helper function to safely perform database operations with timeout protection
  const safeOperation = useCallback(async (
    operation: () => Promise<boolean>,
    successMessage: string,
    errorMessage: string
  ) => {
    if (isProcessing) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return false;
    }

    setIsProcessing(true);
    
    // Set a timeout to reset processing state if operation takes too long
    if (operationTimeoutRef.current) {
      window.clearTimeout(operationTimeoutRef.current);
    }
    
    operationTimeoutRef.current = window.setTimeout(() => {
      console.log("Operation timeout - resetting processing state");
      setIsProcessing(false);
    }, 10000); // 10 seconds timeout

    try {
      const success = await operation();
      
      if (success) {
        toast({
          title: "Succès",
          description: successMessage
        });
        
        try {
          await loadData();
        } catch (loadError) {
          console.error("Erreur lors du rechargement des données:", loadError);
          toast({
            variant: "destructive",
            title: "Avertissement",
            description: "Les changements ont été effectués mais les données n'ont pas pu être rechargées."
          });
        }
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Échec",
          description: errorMessage
        });
        return false;
      }
    } catch (error) {
      console.error("Erreur d'opération:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage
      });
      return false;
    } finally {
      if (operationTimeoutRef.current) {
        window.clearTimeout(operationTimeoutRef.current);
        operationTimeoutRef.current = null;
      }
      setIsProcessing(false);
    }
  }, [isProcessing, loadData]);

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

    const expenseData: ExpenseFormData = {
      title: envelopeData.title,
      budget: envelopeData.budget,
      type: "expense",
      linkedBudgetId: budgetId || envelopeData.linkedBudgetId,
      date: envelopeData.date || new Date().toISOString().split('T')[0]
    };

    const success = await safeOperation(
      () => expenseOperations.addExpense(expenseData),
      `La dépense "${expenseData.title}" a été ajoutée avec succès`,
      "Une erreur est survenue lors de l'ajout de la dépense"
    );
    
    if (success) {
      setAddDialogOpen(false);
    }
  }, [budgetId, safeOperation, setAddDialogOpen]);

  const handleDeleteExpense = useCallback(async (id: string) => {
    if (!id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de dépense manquant"
      });
      return;
    }

    // Vérifie si la dépense existe avant de tenter de la supprimer
    const expenseExists = expenses.some(exp => exp.id === id);
    if (!expenseExists) {
      console.warn(`La dépense avec l'ID ${id} n'existe pas ou a déjà été supprimée`);
      toast({
        variant: "destructive",
        title: "Dépense introuvable",
        description: "La dépense que vous essayez de supprimer n'existe plus."
      });
      return;
    }

    console.log(`Suppression de la dépense confirmée: ${id}`);
    
    await safeOperation(
      () => expenseOperations.deleteExpense(id),
      "La dépense a été supprimée avec succès",
      "Une erreur est survenue lors de la suppression de la dépense"
    );
  }, [expenses, safeOperation]);

  const handleUpdateExpense = useCallback(async (updatedExpense: Expense) => {
    if (!updatedExpense || !updatedExpense.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Données de dépense invalides"
      });
      return;
    }

    // Vérifie si la dépense existe avant de tenter de la mettre à jour
    const expenseExists = expenses.some(exp => exp.id === updatedExpense.id);
    if (!expenseExists) {
      console.warn(`La dépense avec l'ID ${updatedExpense.id} n'existe pas ou a déjà été supprimée`);
      toast({
        variant: "destructive",
        title: "Dépense introuvable",
        description: "La dépense que vous essayez de modifier n'existe plus."
      });
      return;
    }
    
    // S'assurer que toutes les propriétés nécessaires sont définies
    const validatedExpense: Expense = {
      ...updatedExpense,
      type: "expense",
      spent: updatedExpense.budget, // Pour une dépense, spent == budget
      date: updatedExpense.date || new Date().toISOString().split('T')[0]
    };
    
    await safeOperation(
      () => expenseOperations.updateExpense(validatedExpense),
      `La dépense "${validatedExpense.title}" a été modifiée avec succès`,
      "Une erreur est survenue lors de la mise à jour de la dépense"
    );
  }, [expenses, safeOperation]);

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
