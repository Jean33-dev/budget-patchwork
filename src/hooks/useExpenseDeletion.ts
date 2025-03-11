
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
      // Marquer comme en cours de suppression pour éviter les doubles clics
      setIsDeleting(true);
      console.log("Suppression de la dépense avec ID:", selectedExpense.id);
      
      // Copier l'ID localement pour éviter des problèmes si selectedExpense change
      const expenseIdToDelete = selectedExpense.id;
      
      // Supprimer de l'état local d'abord pour une meilleure réactivité UI
      setExpenses(prev => prev.filter(expense => expense.id !== expenseIdToDelete));
      
      // Effectuer la suppression dans la base de données
      const deleteSuccess = await db.deleteExpense(expenseIdToDelete);
      console.log("Résultat de la suppression:", deleteSuccess);

      if (deleteSuccess) {
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${selectedExpense.title}" a été supprimée.`
        });
        
        // Recharger les données après un délai pour permettre à l'UI de se mettre à jour
        setTimeout(() => {
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
      
      // Recharger les données pour restaurer l'état correct
      loadData().catch(err => {
        console.error("Erreur lors du rechargement des données après échec:", err);
      });
      
      return false;
    } finally {
      // Réinitialiser l'état dans tous les cas
      resetDeleteState();
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
