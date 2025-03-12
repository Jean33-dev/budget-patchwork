
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
      
      // Supprimer en DB
      const result = await db.deleteExpense(expenseId);
      console.log("Résultat suppression:", result);
      
      if (result) {
        // Mettre à jour l'état local sans rechargement immédiat
        setExpenses(prevExpenses => {
          const filtered = prevExpenses.filter(exp => exp.id !== expenseId);
          console.log(`État local mis à jour: ${prevExpenses.length} -> ${filtered.length} dépenses`);
          return filtered;
        });
        
        toast({
          title: "Dépense supprimée",
          description: "La dépense a été supprimée avec succès."
        });
        
        console.log("Suppression réussie");
        
        // Important: D'abord réinitialiser l'état pour éviter les effets de bord
        resetDeleteState();
        
        // Différer le rechargement des données en le séparant complètement 
        // du cycle de mise à jour d'état
        setTimeout(() => {
          console.log("Planification du rechargement des données");
          // Utiliser une macro-tâche pour s'assurer que toutes les mises à jour d'état sont terminées
          setTimeout(async () => {
            console.log("Rechargement des données après suppression");
            try {
              await loadData();
              console.log("Données rechargées avec succès");
            } catch (error) {
              console.error("Erreur lors du rechargement des données:", error);
            }
          }, 100);
        }, 0);
        
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
      
      setIsDeleting(false);
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
