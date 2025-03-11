
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
    if (!selectedExpense || isDeleting) {
      return false;
    }

    try {
      setIsDeleting(true);
      
      // Copie locale de l'expense à supprimer
      const expenseToDelete = { ...selectedExpense };
      
      // Mise à jour optimiste de l'UI
      setExpenses(prev => prev.filter(exp => exp.id !== expenseToDelete.id));
      
      // Suppression dans la base de données
      const deleteSuccess = await db.deleteExpense(expenseToDelete.id);

      if (deleteSuccess) {
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${expenseToDelete.title}" a été supprimée.`
        });
        
        // Rechargement des données après une courte pause
        setTimeout(async () => {
          await loadData();
          resetDeleteState();
        }, 100);
        
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
      
      // Rechargement en cas d'erreur
      setTimeout(async () => {
        await loadData();
        resetDeleteState();
      }, 100);
      
      return false;
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
