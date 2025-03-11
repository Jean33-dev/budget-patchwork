
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

    let deleteSuccess = false;
    
    try {
      console.log("[DEBUG] État isDeleting mis à true");
      setIsDeleting(true);
      
      console.log("[DEBUG] Préparation suppression pour ID:", selectedExpense.id);
      const expenseToDelete = { ...selectedExpense };
      
      // Mise à jour optimiste de l'UI avant la suppression réelle
      console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses avant:", (prev: Expense[]) => prev.length);
      setExpenses(prev => {
        const filtered = prev.filter(exp => exp.id !== expenseToDelete.id);
        console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses après:", filtered.length);
        return filtered;
      });
      
      // Petite pause pour permettre à l'UI de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Suppression dans la base de données
      console.log("[DEBUG] Début suppression BD");
      const result = await db.deleteExpense(expenseToDelete.id);
      console.log("[DEBUG] Résultat suppression BD:", result);
      
      if (result) {
        deleteSuccess = true;
        
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${expenseToDelete.title}" a été supprimée.`
        });
        
        // Pause avant rechargement pour éviter les mises à jour simultanées
        console.log("[DEBUG] Début délai avant rechargement");
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Rechargement des données
        console.log("[DEBUG] Début rechargement données");
        await loadData();
        console.log("[DEBUG] Fin rechargement données");
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
      
      // Rechargement en cas d'erreur
      await new Promise(resolve => setTimeout(resolve, 300));
      await loadData();
      
      deleteSuccess = false;
    } finally {
      console.log("[DEBUG] Début finally block");
      
      // Attendre un peu avant de réinitialiser l'état pour éviter les conflits de rendu
      setTimeout(() => {
        resetDeleteState();
        console.log("[DEBUG] Fin finally block - État réinitialisé");
      }, 300);
    }
    
    return deleteSuccess;
  }, [selectedExpense, isDeleting, setExpenses, loadData, toast, resetDeleteState]);

  return {
    selectedExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState
  };
};
