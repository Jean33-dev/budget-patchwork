
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
      
      // Étape 2: Mise à jour de l'état local (dans un setTimeout pour éviter les mises à jour d'état en cascade)
      await new Promise<void>(resolve => {
        setTimeout(() => {
          setExpenses(prevExpenses => {
            const filtered = prevExpenses.filter(exp => exp.id !== expenseId);
            console.log(`État local mis à jour: ${prevExpenses.length} -> ${filtered.length} dépenses`);
            return filtered;
          });
          
          toast({
            title: "Dépense supprimée",
            description: "La dépense a été supprimée avec succès."
          });
          
          console.log("Suppression réussie et état local mis à jour");
          resolve();
        }, 0);
      });

      // Étape 3: Réinitialisation de l'état de suppression (dans un autre setTimeout pour éviter les mises à jour d'état en cascade)
      await new Promise<void>(resolve => {
        setTimeout(() => {
          resetDeleteState();
          console.log("État de suppression réinitialisé");
          resolve();
        }, 50);
      });
      
      // Étape 4: Rechargement des données après un délai pour s'assurer que toutes les mises à jour d'état sont terminées
      await new Promise<void>(resolve => {
        setTimeout(async () => {
          console.log("Rechargement des données après suppression");
          try {
            await loadData();
            console.log("Données rechargées avec succès");
          } catch (error) {
            console.error("Erreur lors du rechargement des données:", error);
          } finally {
            // S'assurer que l'opération est marquée comme terminée même en cas d'erreur
            operationInProgressRef.current = false;
            resolve();
          }
        }, 150);
      });
      
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
