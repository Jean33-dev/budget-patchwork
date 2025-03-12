
import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/types/expense";

export const useExpenseDeletion = (
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
  loadData: () => Promise<void>
) => {
  const { toast } = useToast();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const operationInProgressRef = useRef(false);

  // Function to select an expense to delete
  const handleDeleteClick = useCallback((expense: Expense) => {
    if (operationInProgressRef.current) {
      return false;
    }
    
    setSelectedExpense(expense);
    return true;
  }, []);

  // Function to reset deletion state
  const resetDeleteState = useCallback(() => {
    setSelectedExpense(null);
    setIsDeleting(false);
    operationInProgressRef.current = false;
  }, []);

  // Handle delete confirmation - optimized version
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedExpense || isDeleting || operationInProgressRef.current) {
      return false;
    }

    // Mark operation as in progress
    setIsDeleting(true);
    operationInProgressRef.current = true;
    
    try {
      const expenseId = selectedExpense.id;
      
      // Update local state immediately for better UI responsiveness
      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== expenseId));
      
      // Perform database update in the background
      db.deleteExpense(expenseId)
        .then(success => {
          if (!success) {
            console.error("Échec de la suppression en base de données");
            // Recharger les données en cas d'échec
            loadData();
          }
        })
        .catch(error => {
          console.error("Erreur lors de la suppression en base de données:", error);
          // Recharger les données en cas d'erreur
          loadData();
        });
      
      // Show success toast immediately
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
      
      // Reset state immediately
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
  }, [selectedExpense, isDeleting, toast, resetDeleteState, setExpenses, loadData]);

  return {
    selectedExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState
  };
};
