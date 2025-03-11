
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

  // Fonction pour initialiser la suppression
  const handleDeleteClick = useCallback((expense: Expense) => {
    setSelectedExpense(expense);
    return true;
  }, []);

  // Fonction pour réinitialiser l'état
  const resetDeleteState = useCallback(() => {
    setSelectedExpense(null);
    setIsDeleting(false);
  }, []);

  // Fonction pour confirmer et exécuter la suppression
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedExpense || isDeleting) {
      return false;
    }

    setIsDeleting(true);
    
    try {
      // Stocker l'ID de la dépense sélectionnée car nous allons réinitialiser l'état selectedExpense
      const expenseId = selectedExpense.id;
      
      // 1. Mise à jour optimiste de l'UI
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      
      // 2. Suppression dans la base de données
      const result = await db.deleteExpense(expenseId);
      
      if (result) {
        toast({
          title: "Dépense supprimée",
          description: "La dépense a été supprimée avec succès."
        });
        
        // 3. Recharger les données après un court délai
        // On utilise setTimeout pour éviter les mises à jour d'état simultanées
        await new Promise(resolve => setTimeout(resolve, 300));
        await loadData();
        
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
      
      // En cas d'erreur, recharger les données pour rétablir l'état correct
      await loadData();
      
      return false;
    } finally {
      // Important: réinitialiser l'état APRÈS toutes les opérations asynchrones
      setTimeout(() => {
        resetDeleteState();
      }, 300);
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
