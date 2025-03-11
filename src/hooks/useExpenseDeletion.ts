
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
    console.log("[DEBUG] Début handleDeleteClick avec expense:", expense);
    setSelectedExpense(expense);
    console.log("[DEBUG] Fin handleDeleteClick - selectedExpense mis à jour");
    return true;
  }, []);

  // Fonction pour réinitialiser l'état
  const resetDeleteState = useCallback(() => {
    console.log("[DEBUG] Début resetDeleteState");
    setSelectedExpense(null);
    setIsDeleting(false);
    console.log("[DEBUG] Fin resetDeleteState - états réinitialisés");
  }, []);

  // Fonction pour confirmer et exécuter la suppression
  const handleDeleteConfirm = useCallback(async () => {
    console.log("[DEBUG] Début handleDeleteConfirm");
    
    if (!selectedExpense || isDeleting) {
      console.log("[DEBUG] Annulation - Pas d'expense sélectionnée ou déjà en cours de suppression");
      return false;
    }

    setIsDeleting(true);
    console.log("[DEBUG] État isDeleting mis à true");
    
    try {
      console.log("[DEBUG] Préparation suppression pour ID:", selectedExpense.id);
      const expenseId = selectedExpense.id; // Stocker l'ID pour y faire référence même après réinitialisation
      
      // Mise à jour optimiste de l'UI
      console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses avant:", (prev: Expense[]) => prev.length);
      setExpenses(prev => {
        const filtered = prev.filter(exp => exp.id !== expenseId);
        console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses après:", filtered.length);
        return filtered;
      });
      
      // Délai pour permettre à React de mettre à jour l'UI
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Suppression dans la base de données
      console.log("[DEBUG] Début suppression BD");
      const result = await db.deleteExpense(expenseId);
      console.log("[DEBUG] Résultat suppression BD:", result);
      
      if (result) {
        toast({
          title: "Dépense supprimée",
          description: `La dépense a été supprimée avec succès.`
        });
        
        // Attendre avant de recharger les données pour éviter les conflits d'état
        console.log("[DEBUG] Début délai avant rechargement");
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Recharger les données
        console.log("[DEBUG] Début rechargement données");
        await loadData();
        console.log("[DEBUG] Fin rechargement données");
        
        return true;
      } else {
        throw new Error("La suppression a échoué");
      }
    } catch (error) {
      console.error("[ERREUR] Erreur lors de la suppression:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // Recharger en cas d'erreur pour rétablir l'état correct
      await new Promise(resolve => setTimeout(resolve, 400));
      await loadData();
      
      return false;
    } finally {
      console.log("[DEBUG] Début finally block");
      
      // Important: attendre avant de réinitialiser l'état
      setTimeout(() => {
        resetDeleteState();
        console.log("[DEBUG] Fin finally block - État réinitialisé");
      }, 500);
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
