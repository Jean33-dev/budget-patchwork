
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
    console.log("[DEBUG] Début handleDeleteClick avec expense:", expense);
    setSelectedExpense(expense);
    console.log("[DEBUG] Fin handleDeleteClick - selectedExpense mis à jour");
    return true;
  }, []);

  const resetDeleteState = useCallback(() => {
    console.log("[DEBUG] Début resetDeleteState");
    setSelectedExpense(null);
    setIsDeleting(false);
    console.log("[DEBUG] Fin resetDeleteState - états réinitialisés");
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    console.log("[DEBUG] Début handleDeleteConfirm");
    
    if (!selectedExpense || isDeleting) {
      console.log("[DEBUG] Abandon handleDeleteConfirm - conditions non remplies:", {
        selectedExpense,
        isDeleting
      });
      return false;
    }

    try {
      setIsDeleting(true);
      console.log("[DEBUG] État isDeleting mis à true");
      
      // Créer une copie locale de l'expense à supprimer
      const expenseToDelete = { ...selectedExpense };
      console.log("[DEBUG] Préparation suppression pour ID:", expenseToDelete.id);
      
      // Mise à jour optimiste de l'UI - faire une copie pour éviter les problèmes de référence
      setExpenses(prev => {
        console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses avant:", prev.length);
        const newExpenses = prev.filter(exp => exp.id !== expenseToDelete.id);
        console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses après:", newExpenses.length);
        return newExpenses;
      });
      
      // Courte pause pour permettre à l'UI de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Suppression dans la BD
      console.log("[DEBUG] Début suppression BD");
      const deleteSuccess = await db.deleteExpense(expenseToDelete.id);
      console.log("[DEBUG] Résultat suppression BD:", deleteSuccess);

      if (deleteSuccess) {
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${expenseToDelete.title}" a été supprimée.`
        });
        
        // Délai avant le rechargement des données
        console.log("[DEBUG] Début délai avant rechargement");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          console.log("[DEBUG] Début rechargement données");
          await loadData();
          console.log("[DEBUG] Fin rechargement données");
        } catch (error) {
          console.error("[DEBUG] Erreur pendant le rechargement des données:", error);
        }
        
        return true;
      } else {
        throw new Error("La suppression a échoué");
      }
    } catch (error) {
      console.error("[DEBUG] Erreur dans handleDeleteConfirm:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // Recharger en cas d'erreur
      try {
        console.log("[DEBUG] Tentative de rechargement après erreur");
        await loadData();
      } catch (reloadError) {
        console.error("[DEBUG] Erreur pendant le rechargement après erreur:", reloadError);
      }
      
      return false;
    } finally {
      console.log("[DEBUG] Début finally block");
      
      // Attendre un moment avant de réinitialiser l'état
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        resetDeleteState();
      } catch (error) {
        console.error("[DEBUG] Erreur pendant la réinitialisation de l'état:", error);
      }
      
      console.log("[DEBUG] Fin finally block - État réinitialisé");
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
