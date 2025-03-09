
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
    setSelectedExpense(expense);
    return true; // Return true to indicate dialog should open
  };

  const resetDeleteState = () => {
    setSelectedExpense(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpense || isDeleting) return false;

    try {
      setIsDeleting(true);
      
      console.log("Suppression de la dépense avec ID:", selectedExpense.id);
      
      // Important: Attendre explicitement la résolution de la promesse
      const deleteSuccess = await db.deleteExpense(selectedExpense.id);
      console.log("Résultat de la suppression:", deleteSuccess);

      if (deleteSuccess) {
        // Si la suppression a réussi, mettre à jour l'état local
        setExpenses(prev => prev.filter(expense => expense.id !== selectedExpense.id));
        
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${selectedExpense.title}" a été supprimée.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La dépense n'a pas pu être supprimée. Elle n'existe peut-être plus."
        });
      }

      // Nettoyer l'état de l'UI dans tous les cas
      resetDeleteState();
      
      // Utiliser un délai plus long pour éviter les problèmes de rendu
      setTimeout(() => {
        setIsDeleting(false);
        loadData(); // Recharger les données fraîches
      }, 500);
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      setIsDeleting(false);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      resetDeleteState();
      return false;
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
