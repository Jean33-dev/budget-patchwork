
import { useState, useCallback, useRef } from "react";
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
  const operationInProgressRef = useRef(false);

  // Fonction pour sélectionner une dépense à supprimer
  const handleDeleteClick = useCallback((expense: Expense) => {
    console.log("handleDeleteClick appelé pour:", expense.id);
    setSelectedExpense(expense);
    return true;
  }, []);

  // Fonction pour réinitialiser l'état de suppression
  const resetDeleteState = useCallback(() => {
    console.log("resetDeleteState appelé");
    setSelectedExpense(null);
    setIsDeleting(false);
    operationInProgressRef.current = false;
  }, []);

  // Fonction qui gère la confirmation de suppression
  const handleDeleteConfirm = useCallback(async () => {
    // Vérification des conditions préalables
    if (!selectedExpense) {
      console.log("Pas de dépense sélectionnée");
      return false;
    }
    
    if (isDeleting || operationInProgressRef.current) {
      console.log("Opération déjà en cours, abandon");
      return false;
    }

    // Marquer le début de l'opération
    console.log("Début suppression pour:", selectedExpense.id);
    setIsDeleting(true);
    operationInProgressRef.current = true;
    
    try {
      const expenseId = selectedExpense.id;
      console.log("Tentative de suppression:", expenseId);
      
      // Étape 1: Suppression en base de données
      const result = await db.deleteExpense(expenseId);
      console.log("Résultat suppression:", result);
      
      if (!result) {
        throw new Error("Échec de la suppression");
      }
      
      // Étape 2: Mise à jour de l'état local de manière synchrone
      setExpenses(prevExpenses => {
        const filtered = prevExpenses.filter(exp => exp.id !== expenseId);
        console.log(`État local mis à jour: ${prevExpenses.length} -> ${filtered.length} dépenses`);
        return filtered;
      });
      
      console.log("Suppression réussie");
      
      // Afficher le toast immédiatement après mise à jour de l'UI
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
      
      // Réinitialiser l'état de suppression immédiatement
      resetDeleteState();
      
      // Planifier le rechargement des données après une courte pause
      console.log("Planification du rechargement des données");
      
      // Retourner true immédiatement pour permettre la fermeture du dialogue
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // Réinitialiser l'état en cas d'erreur
      setIsDeleting(false);
      operationInProgressRef.current = false;
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
