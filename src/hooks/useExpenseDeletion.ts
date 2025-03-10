
import { useState } from "react";
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

  const handleDeleteClick = (expense: Expense) => {
    console.log("Sélection de la dépense pour suppression:", expense);
    setSelectedExpense(expense);
    return true;
  };

  const resetDeleteState = () => {
    console.log("Réinitialisation de l'état de suppression");
    setSelectedExpense(null);
    setIsDeleting(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpense || isDeleting) {
      console.log("Suppression impossible:", { selectedExpense, isDeleting });
      return false;
    }

    try {
      setIsDeleting(true);
      console.log("Suppression de la dépense avec ID:", selectedExpense.id);
      
      // Attendre explicitement la résolution de la promesse
      const deleteSuccess = await db.deleteExpense(selectedExpense.id);
      console.log("Résultat de la suppression:", deleteSuccess);

      if (deleteSuccess) {
        // Mise à jour de l'état local seulement si la suppression a réussi
        setExpenses(prev => prev.filter(expense => expense.id !== selectedExpense.id));
        
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${selectedExpense.title}" a été supprimée.`
        });

        // Réinitialiser l'état
        resetDeleteState();
        
        // Recharger les données après un court délai
        setTimeout(() => {
          loadData();
        }, 500);
        
        return true;
      } else {
        throw new Error("La suppression a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      resetDeleteState();
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    selectedExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState
  };
};
