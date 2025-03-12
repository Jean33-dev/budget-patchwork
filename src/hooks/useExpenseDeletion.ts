import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/types/expense";

export const useExpenseDeletion = (
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
  loadData: () => Promise<void>,
  onSuccessCallback?: () => void
) => {
  const { toast } = useToast();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const operationInProgressRef = useRef(false);

  // Function to select an expense to delete
  const handleDeleteClick = useCallback((expense: Expense) => {
    if (operationInProgressRef.current) {
      console.log("Une opération est déjà en cours, ignoré");
      return false;
    }
    
    console.log("handleDeleteClick appelé pour:", expense.id);
    setSelectedExpense(expense);
    return true;
  }, []);

  // Function to reset deletion state
  const resetDeleteState = useCallback(() => {
    console.log("resetDeleteState appelé");
    setSelectedExpense(null);
    setIsDeleting(false);
    operationInProgressRef.current = false;
  }, []);

  // Database hide operation - optimisé pour masquer au lieu de supprimer
  const performDatabaseHide = useCallback(async (expenseId: string): Promise<boolean> => {
    try {
      console.log("Exécution du masquage en base de données pour:", expenseId);
      return await db.deleteExpense(expenseId); // On utilise la même méthode qui maintenant masque au lieu de supprimer
    } catch (error) {
      console.error("Erreur lors du masquage en base de données:", error);
      return false;
    }
  }, []);

  // Update local state after hiding
  const updateLocalState = useCallback((expenseId: string): void => {
    setExpenses(prevExpenses => {
      const filtered = prevExpenses.filter(exp => exp.id !== expenseId);
      console.log(`État local mis à jour: ${prevExpenses.length} -> ${filtered.length} dépenses`);
      return filtered;
    });
  }, [setExpenses]);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedExpense || isDeleting || operationInProgressRef.current) {
      console.log("Pas de dépense sélectionnée ou opération déjà en cours");
      return false;
    }

    // Mark operation as in progress
    setIsDeleting(true);
    operationInProgressRef.current = true;
    
    try {
      const expenseId = selectedExpense.id;
      console.log("Début masquage pour:", expenseId);
      
      // Step 1: Hide in database
      const result = await performDatabaseHide(expenseId);
      
      if (!result) {
        throw new Error("Échec du masquage");
      }
      
      // Step 2: Update local state
      updateLocalState(expenseId);
      
      console.log("Masquage réussi");
      
      // Show toast
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
      
      // Note: We've removed the navigation callback to keep user on the expense page
      
      // Reset state immediately to allow UI to update
      resetDeleteState();
      
      return true;
    } catch (error) {
      console.error("Erreur lors du masquage:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // Reset state on error
      resetDeleteState();
      return false;
    }
  }, [selectedExpense, isDeleting, toast, resetDeleteState, performDatabaseHide, updateLocalState]);

  return {
    selectedExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState,
    onDeleteSuccess: onSuccessCallback 
  };
};
