
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
      // Marquer comme en cours de suppression
      setIsDeleting(true);
      
      // Sauvegarder les informations de la dépense avant toute opération
      const expenseToDelete = { ...selectedExpense };
      console.log("Suppression de la dépense avec ID:", expenseToDelete.id);
      
      // Supprimer de l'état local pour une meilleure réactivité
      setExpenses(prev => prev.filter(exp => exp.id !== expenseToDelete.id));
      
      // Effectuer la suppression dans la base de données
      const deleteSuccess = await db.deleteExpense(expenseToDelete.id);
      console.log("Résultat de la suppression:", deleteSuccess);

      if (deleteSuccess) {
        // Afficher une notification de succès
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${expenseToDelete.title}" a été supprimée.`
        });
        
        // Attendre puis recharger les données
        setTimeout(() => {
          // Recharger les données de manière asynchrone
          loadData().catch(err => {
            console.error("Erreur lors du rechargement des données:", err);
          });
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
      
      // Recharger les données pour rétablir l'état correct
      setTimeout(async () => {
        try {
          await loadData();
        } catch (err) {
          console.error("Erreur lors du rechargement des données après échec:", err);
        }
      }, 500);
      
      return false;
    } finally {
      // Attendre avant de réinitialiser l'état
      setTimeout(() => {
        resetDeleteState();
      }, 1000);
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
