
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
    
    console.log("handleDeleteClick appelé pour:", expense.id);
    setSelectedExpense(expense);
    return true;
  }, []);

  // Fonction pour réinitialiser l'état de suppression
  const resetDeleteState = useCallback(() => {
    console.log("resetDeleteState appelé");
    
    // Nettoyage du timeout existant si présent
    if (dataLoadTimeoutRef.current !== null) {
      window.clearTimeout(dataLoadTimeoutRef.current);
      dataLoadTimeoutRef.current = null;
    }
    
    setSelectedExpense(null);
    setIsDeleting(false);
    operationInProgressRef.current = false;
  }, []);

  // Fonction pour effectuer l'opération de suppression en base de données
  const performDatabaseDeletion = useCallback(async (expenseId: string): Promise<boolean> => {
    try {
      console.log("Exécution de la suppression en base de données pour:", expenseId);
      return await db.deleteExpense(expenseId);
    } catch (error) {
      console.error("Erreur lors de la suppression en base de données:", error);
      return false;
    }
  }, []);

  // Fonction pour mettre à jour l'état local après suppression
  const updateLocalState = useCallback((expenseId: string): void => {
    setExpenses(prevExpenses => {
      const filtered = prevExpenses.filter(exp => exp.id !== expenseId);
      console.log(`État local mis à jour: ${prevExpenses.length} -> ${filtered.length} dépenses`);
      return filtered;
    });
  }, [setExpenses]);

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
      const result = await performDatabaseDeletion(expenseId);
      
      if (!result) {
        throw new Error("Échec de la suppression");
      }
      
      // Étape 2: Mise à jour de l'état local
      updateLocalState(expenseId);
      
      console.log("Suppression réussie");
      
      // Afficher le toast
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
      
      // Planification du rechargement des données
      console.log("Planification du rechargement des données");
      
      // Nettoyage du timeout existant si présent
      if (dataLoadTimeoutRef.current !== null) {
        window.clearTimeout(dataLoadTimeoutRef.current);
      }
      
      // Nous renvoyons true immédiatement pour permettre à l'UI de se mettre à jour
      // Le rechargement des données se fera en arrière-plan
      resetDeleteState();
      
      // Programmation d'un rechargement différé des données
      dataLoadTimeoutRef.current = window.setTimeout(() => {
        loadData().then(() => {
          console.log("Données rechargées avec succès après suppression");
          dataLoadTimeoutRef.current = null;
        });
      }, 500);
      
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
  }, [selectedExpense, isDeleting, loadData, toast, resetDeleteState, performDatabaseDeletion, updateLocalState]);

  return {
    selectedExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState
  };
};
