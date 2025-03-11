
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
      
      // Sauvegarder les informations de la dépense avant de changer les états
      const expenseToDelete = { ...selectedExpense };
      console.log("Suppression de la dépense avec ID:", expenseToDelete.id);
      
      // Mettre à jour l'état local immédiatement pour améliorer la réactivité
      setExpenses(prev => prev.filter(exp => exp.id !== expenseToDelete.id));
      
      // Effectuer la suppression dans la base de données
      const deleteSuccess = await db.deleteExpense(expenseToDelete.id);
      console.log("Résultat de la suppression:", deleteSuccess);

      if (deleteSuccess) {
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${expenseToDelete.title}" a été supprimée.`
        });
        
        // Attendre que la notification soit affichée avant de recharger
        setTimeout(() => {
          loadData().catch(err => {
            console.error("Erreur lors du rechargement des données:", err);
          });
        }, 1000);
        
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
      
      // Recharger les données pour restaurer l'état correct
      await loadData().catch(err => {
        console.error("Erreur lors du rechargement des données après échec:", err);
      });
      
      return false;
    } finally {
      // Attendre un peu avant de réinitialiser l'état
      setTimeout(() => {
        resetDeleteState();
      }, 500);
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
