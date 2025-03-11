
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
    console.log("[DEBUG] Début handleDeleteClick avec expense:", expense);
    setSelectedExpense(expense);
    console.log("[DEBUG] Fin handleDeleteClick - selectedExpense mis à jour");
    return true;
  };

  const resetDeleteState = () => {
    console.log("[DEBUG] Début resetDeleteState");
    setSelectedExpense(null);
    setIsDeleting(false);
    console.log("[DEBUG] Fin resetDeleteState - états réinitialisés");
  };

  const handleDeleteConfirm = async () => {
    console.log("[DEBUG] Début handleDeleteConfirm");
    
    if (!selectedExpense || isDeleting) {
      console.log("[DEBUG] Abandon handleDeleteConfirm - conditions non remplies:", {
        selectedExpense,
        isDeleting
      });
      return false;
    }

    try {
      setIsDeleting(true);
      console.log("[DEBUG] État isDeleting mis à true");
      
      const expenseToDelete = { ...selectedExpense };
      console.log("[DEBUG] Préparation suppression pour ID:", expenseToDelete.id);
      
      // Mise à jour optimiste de l'UI
      setExpenses(prev => {
        console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses avant:", prev.length);
        const newExpenses = prev.filter(exp => exp.id !== expenseToDelete.id);
        console.log("[DEBUG] Mise à jour optimiste - Nombre d'expenses après:", newExpenses.length);
        return newExpenses;
      });
      
      // Suppression dans la BD
      console.log("[DEBUG] Début suppression BD");
      const deleteSuccess = await db.deleteExpense(expenseToDelete.id);
      console.log("[DEBUG] Résultat suppression BD:", deleteSuccess);

      if (deleteSuccess) {
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${expenseToDelete.title}" a été supprimée.`
        });
        
        // Attendre avant de recharger
        console.log("[DEBUG] Début délai avant rechargement");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("[DEBUG] Début rechargement données");
        await loadData();
        console.log("[DEBUG] Fin rechargement données");
        
        return true;
      } else {
        throw new Error("La suppression a échoué");
      }
    } catch (error) {
      console.error("[DEBUG] Erreur dans handleDeleteConfirm:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // Recharger en cas d'erreur
      console.log("[DEBUG] Tentative de rechargement après erreur");
      await loadData();
      
      return false;
    } finally {
      console.log("[DEBUG] Début finally block");
      await new Promise(resolve => setTimeout(resolve, 500));
      resetDeleteState();
      console.log("[DEBUG] Fin finally block - État réinitialisé");
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

