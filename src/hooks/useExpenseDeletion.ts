
import { useState, useCallback } from "react";
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

  const handleDeleteClick = useCallback((expense: Expense) => {
    setSelectedExpense(expense);
    return true;
  }, []);

  const resetDeleteState = useCallback(() => {
    setSelectedExpense(null);
    setIsDeleting(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedExpense || isDeleting) return false;

    setIsDeleting(true);
    
    try {
      const expenseId = selectedExpense.id;
      
      // 1. Suppression dans la base de données d'abord
      const result = await db.deleteExpense(expenseId);
      
      if (result) {
        // 2. Si la suppression a réussi, mise à jour de l'état local
        setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
        
        toast({
          title: "Dépense supprimée",
          description: "La dépense a été supprimée avec succès."
        });
        
        return true;
      } else {
        throw new Error("La suppression a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // En cas d'erreur, on recharge les données pour s'assurer de la cohérence
      await loadData();
      return false;
    } finally {
      // Réinitialisation de l'état après un court délai
      setTimeout(resetDeleteState, 300);
    }
  }, [selectedExpense, isDeleting, setExpenses, loadData, toast, resetDeleteState]);

  return {
    selectedExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState
  };
};
