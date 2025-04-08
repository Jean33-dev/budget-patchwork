
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { budgetTransitionOperations } from "@/utils/budget-transition-operations";
import { transactionTransitionOperations } from "@/utils/transaction-transition-operations";
import { useState, useCallback, useEffect } from "react";

export const useTransitionProcessor = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const { saveTransitionPreferences } = useTransitionPreferences();
  const [progress, setProgress] = useState<{ step: string; percentage: number }>({ step: "", percentage: 0 });
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  
  // Vérifier l'état de l'initialisation de la base de données
  useEffect(() => {
    const checkDbInitialization = async () => {
      try {
        // Cette fonction sera implémentée par dbManager
        // mais pour l'instant, on suppose que la base de données est initialisée
        setIsDbInitialized(true);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'initialisation de la base de données:", error);
        setIsDbInitialized(false);
      }
    };
    
    checkDbInitialization();
  }, []);

  const handleMonthTransition = useCallback(async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      console.log("Début de la transition du mois...");
      setProgress({ step: "Préparation", percentage: 5 });
      
      if (!isDbInitialized) {
        console.warn("La base de données n'est pas initialisée. Initialisation en cours...");
        setProgress({ step: "Initialisation de la base de données", percentage: 10 });
        // Attendre l'initialisation (dans un cas normal, cela devrait déjà être fait)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Save preferences for next time
      saveTransitionPreferences(envelopes);
      console.log("Transition preferences saved:", envelopes);
      
      // Delay slightly to ensure UI updates with the first progress state
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress({ step: "Traitement des budgets", percentage: 20 });
      
      // Process budget transitions first (this is faster and doesn't require loading all expenses)
      console.log("Traitement des budgets pour la transition...");
      try {
        await budgetTransitionOperations.processEnvelopeTransitions(envelopes);
        console.log("Transition des budgets terminée");
      } catch (budgetError) {
        console.error("Erreur lors du traitement des budgets:", budgetError);
        toast({
          variant: "destructive",
          title: "Erreur de transition des budgets",
          description: "Les budgets n'ont pas pu être traités correctement."
        });
        return false;
      }
      
      setProgress({ step: "Traitement des transactions", percentage: 50 });
      
      // Process all transactions (delete existing ones and add new fixed ones)
      try {
        await transactionTransitionOperations.processTransactionTransition(categories, setCategories);
      } catch (transactionError) {
        console.error("Erreur lors du traitement des transactions:", transactionError);
        toast({
          variant: "destructive",
          title: "Erreur de transition des transactions",
          description: "Les transactions n'ont pas pu être traitées correctement."
        });
        return false;
      }
      
      setProgress({ step: "Réinitialisation des dépenses", percentage: 80 });
      
      // Reset category spent values
      try {
        await transactionTransitionOperations.resetCategorySpending(categories, setCategories);
      } catch (resetError) {
        console.error("Erreur lors de la réinitialisation des dépenses:", resetError);
        toast({
          variant: "destructive",
          title: "Erreur de réinitialisation",
          description: "Les catégories n'ont pas pu être réinitialisées correctement."
        });
        return false;
      }
      
      setProgress({ step: "Terminé", percentage: 100 });
      console.log("Transition du mois terminée avec succès");
      toast({
        title: "Transition effectuée",
        description: "Les budgets ont été mis à jour pour le nouveau mois."
      });
    } catch (error) {
      console.error("Erreur lors de la transition:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la transition des budgets."
      });
      success = false;
    }

    return success;
  }, [categories, setCategories, toast, saveTransitionPreferences, isDbInitialized]);

  return {
    handleMonthTransition,
    progress
  };
};
