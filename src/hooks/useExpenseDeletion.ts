
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
    console.log("resetDeleteState appelé");
    setSelectedExpense(null);
    setIsDeleting(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedExpense || isDeleting) {
      console.log("Abandon confirmation: selectedExpense ou isDeleting", { selectedExpense, isDeleting });
      return false;
    }

    console.log("Début de suppression pour:", selectedExpense.id);
    setIsDeleting(true);
    console.log("isDeleting défini à:", true);
    
    try {
      const expenseId = selectedExpense.id;
      console.log("Tentative de suppression dans la DB:", expenseId);
      
      // Suppression dans la base de données d'abord
      const result = await db.deleteExpense(expenseId);
      console.log("Résultat de la suppression DB:", result);
      
      if (result) {
        console.log("Mise à jour du state local après suppression");
        // Mise à jour de l'état local avec nouvelle fonction pour éviter les problèmes
        setExpenses((prevExpenses) => {
          const updatedExpenses = prevExpenses.filter(exp => exp.id !== expenseId);
          console.log("Nouvelles dépenses:", updatedExpenses.length);
          return updatedExpenses;
        });
        
        toast({
          title: "Dépense supprimée",
          description: "La dépense a été supprimée avec succès."
        });
        
        console.log("Suppression terminée avec succès");
        return true;
      } else {
        throw new Error("La suppression a échoué");
      }
    } catch (error) {
      console.error("Erreur détaillée lors de la suppression:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      console.log("Tentative de rechargement des données après erreur");
      await loadData();
      return false;
    } finally {
      console.log("Finally block: nettoyage des états");
      // Suppression du setTimeout pour tester s'il est en cause
      resetDeleteState();
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
