
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
  const dataLoadTimeoutRef = useRef<number | null>(null);

  // Fonction pour sélectionner une dépense à supprimer
  const handleDeleteClick = useCallback((expense: Expense) => {
    if (operationInProgressRef.current) {
      console.log("Une opération est déjà en cours, ignoré");
      return false;
    }
    
    console.log("Sélection de la dépense pour suppression:", expense.id);
    setSelectedExpense(expense);
    return true;
  }, []);

  // Fonction pour réinitialiser l'état de suppression
  const resetDeleteState = useCallback(() => {
    console.log("Réinitialisation de l'état de suppression");
    
    // Nettoyage du timeout existant si présent
    if (dataLoadTimeoutRef.current !== null) {
      window.clearTimeout(dataLoadTimeoutRef.current);
      dataLoadTimeoutRef.current = null;
    }
    
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
    console.log("Début de la suppression pour:", selectedExpense.id);
    setIsDeleting(true);
    operationInProgressRef.current = true;
    
    try {
      const expenseId = selectedExpense.id;
      console.log("Tentative de suppression:", expenseId);
      
      // Suppression en base de données
      const result = await db.deleteExpense(expenseId);
      
      if (!result) {
        throw new Error("Échec de la suppression en base de données");
      }
      
      // Mise à jour optimiste de l'état local
      setExpenses(prevExpenses => {
        const filtered = prevExpenses.filter(exp => exp.id !== expenseId);
        console.log(`État local mis à jour: ${prevExpenses.length} -> ${filtered.length} dépenses`);
        return filtered;
      });
      
      console.log("Suppression réussie");
      
      // Afficher le toast
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
      
      // Nettoyage du timeout existant si présent
      if (dataLoadTimeoutRef.current !== null) {
        window.clearTimeout(dataLoadTimeoutRef.current);
      }
      
      // Programmation d'un rechargement différé des données
      dataLoadTimeoutRef.current = window.setTimeout(() => {
        loadData().then(() => {
          console.log("Données rechargées avec succès après suppression");
          dataLoadTimeoutRef.current = null;
        });
      }, 500);
      
      resetDeleteState();
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      
      // Réinitialiser l'état en cas d'erreur
      resetDeleteState();
      return false;
    }
  }, [selectedExpense, isDeleting, loadData, toast, resetDeleteState, setExpenses]);

  return {
    selectedExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState
  };
};
