
import { useState, useCallback, useRef, useEffect } from "react";
import { useExpenseData } from "./useExpenseData";
import { expenseOperations, ExpenseFormData } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";
import { toast } from "@/components/ui/use-toast";

export type { Expense, Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { expenses, availableBudgets, isLoading: isDataLoading, error, initAttempted, loadData } = useExpenseData(budgetId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const operationTimeoutRef = useRef<number | null>(null);
  const operationInProgressRef = useRef(false);
  const [operationError, setOperationError] = useState<Error | null>(null);

  // Reset operation error when data loading changes
  useEffect(() => {
    if (!isDataLoading) {
      setOperationError(null);
    }
  }, [isDataLoading]);

  // Cleanup function to reset processing state if component unmounts during operation
  useEffect(() => {
    return () => {
      if (operationTimeoutRef.current) {
        window.clearTimeout(operationTimeoutRef.current);
        operationTimeoutRef.current = null;
      }
    };
  }, []);

  // Helper function to safely perform database operations with timeout protection
  const safeOperation = useCallback(async (
    operation: () => Promise<boolean>,
    successMessage: string,
    errorMessage: string
  ) => {
    if (operationInProgressRef.current) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return false;
    }

    // Set processing state
    setIsProcessing(true);
    operationInProgressRef.current = true;
    
    // Set a timeout to reset processing state if operation takes too long
    if (operationTimeoutRef.current) {
      window.clearTimeout(operationTimeoutRef.current);
    }
    
    operationTimeoutRef.current = window.setTimeout(() => {
      console.log("Operation timeout - resetting processing state");
      setIsProcessing(false);
      operationInProgressRef.current = false;
      toast({
        variant: "destructive",
        title: "Opération trop longue",
        description: "L'opération a pris trop de temps. Veuillez réessayer."
      });
    }, 8000); // 8 seconds timeout

    try {
      const success = await operation();
      
      // Clear timeout since operation completed
      if (operationTimeoutRef.current) {
        window.clearTimeout(operationTimeoutRef.current);
        operationTimeoutRef.current = null;
      }
      
      if (success) {
        toast({
          title: "Succès",
          description: successMessage
        });
        
        try {
          // Schedule data reload after a short delay to allow the database operations to complete
          await new Promise(resolve => setTimeout(resolve, 500));
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
      setOperationError(error instanceof Error ? error : new Error(errorMessage));
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage
      });
      return false;
    } finally {
      // Ensure processing state is reset regardless of outcome
      if (operationTimeoutRef.current) {
        window.clearTimeout(operationTimeoutRef.current);
        operationTimeoutRef.current = null;
      }
      
      // Short delay to ensure UI updates properly before resetting state
      setTimeout(() => {
        setIsProcessing(false);
        operationInProgressRef.current = false;
      }, 300);
    }
  }, [loadData]);

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

    // Légère vérification côté client avant d'envoyer à la base de données
    const expenseExists = expenses.some(exp => exp.id === id);
    if (!expenseExists) {
      console.warn(`La dépense avec l'ID ${id} n'existe pas ou a déjà été supprimée`);
      toast({
        variant: "default",
        title: "Dépense introuvable",
        description: "La dépense que vous essayez de supprimer n'existe plus."
      });
      return;
    }

    console.log(`Suppression de la dépense confirmée: ${id}`);
    
    await safeOperation(
      async () => {
        return await expenseOperations.deleteExpense(id);
      },
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

    // Légère vérification côté client avant d'envoyer à la base de données
    const expenseExists = expenses.some(exp => exp.id === updatedExpense.id);
    if (!expenseExists) {
      console.warn(`La dépense avec l'ID ${updatedExpense.id} n'existe pas ou a déjà été supprimée`);
      toast({
        variant: "default",
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
      async () => {
        return await expenseOperations.updateExpense(validatedExpense);
      },
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
    isLoading: isDataLoading,
    isProcessing,
    error: error || operationError,
    initAttempted
  };
};
