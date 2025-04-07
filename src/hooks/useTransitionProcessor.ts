
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { budgetTransitionOperations } from "@/utils/budget-transition-operations";
import { transactionTransitionOperations } from "@/utils/transaction-transition-operations";

export const useTransitionProcessor = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const { saveTransitionPreferences } = useTransitionPreferences();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      console.log("Début de la transition du mois...");
      
      // Save preferences for next time
      saveTransitionPreferences(envelopes);
      
      // Process budget transitions first (this is faster and doesn't require loading all expenses)
      console.log("Traitement des budgets pour la transition...");
      await budgetTransitionOperations.processEnvelopeTransitions(envelopes);
      console.log("Transition des budgets terminée");
      
      // Process all transactions (delete existing ones and add new fixed ones)
      await transactionTransitionOperations.processTransactionTransition(categories, setCategories);
      
      // Reset category spent values
      await transactionTransitionOperations.resetCategorySpending(categories, setCategories);
      
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
  };

  return {
    handleMonthTransition
  };
};
