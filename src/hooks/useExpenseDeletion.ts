
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
    console.log("handleDeleteClick appelé pour:", expense.id);
    setSelectedExpense(expense);
    return true;
  }, []);

  const resetDeleteState = useCallback(() => {
    console.log("resetDeleteState appelé");
    setSelectedExpense(null);
    setIsDeleting(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedExpense || isDeleting) {
      console.log("Abandon suppression:", { 
        selectedExpenseId: selectedExpense?.id || "aucun", 
        isDeleting 
      });
      return false;
    }

    console.log("Début suppression pour:", selectedExpense.id);
    setIsDeleting(true);
    
    try {
      const expenseId = selectedExpense.id;
      console.log("Tentative de suppression:", expenseId);
      
      // Important: Supprimer en DB d'abord
      const result = await db.deleteExpense(expenseId);
      console.log("Résultat suppression:", result);
      
      if (result) {
        // Mettre à jour l'état local IMMÉDIATEMENT sans attendre
        setExpenses(prevExpenses => {
          const filtered = prevExpenses.filter(exp => exp.id !== expenseId);
          console.log(`État local mis à jour: ${prevExpenses.length} -> ${filtered.length} dépenses`);
          return filtered;
        });
        
        toast({
          title: "Dépense supprimée",
          description: "La dépense a été supprimée avec succès."
        });
        
        // Important: Pas de loadData() ici pour éviter double chargement
        console.log("Suppression réussie");
        resetDeleteState();
        return true;
      } else {
        throw new Error("Échec de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // En cas d'erreur seulement, recharger les données pour synchroniser
      await loadData();
      resetDeleteState();
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
