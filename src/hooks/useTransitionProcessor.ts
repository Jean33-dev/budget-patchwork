
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { useBudgetTransitioner } from "./transition/useBudgetTransitioner";
import { useExpenseIncomeReset } from "./transition/useExpenseIncomeReset";

export const useTransitionProcessor = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const { saveTransitionPreferences } = useTransitionPreferences();
  const { processEnvelopeTransitions } = useBudgetTransitioner();
  const { 
    resetNonRecurringExpenses, 
    resetNonRecurringIncomes,
    resetCategorySpent 
  } = useExpenseIncomeReset();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      // Save preferences for next time
      saveTransitionPreferences(envelopes);
      
      // Réinitialiser les dépenses non récurrentes
      const expensesResult = await resetNonRecurringExpenses();
      
      // Réinitialiser les revenus non récurrents
      const incomesResult = await resetNonRecurringIncomes();
      
      console.log("Vérification après suppression sélective:");
      console.log(`Dépenses restantes: ${expensesResult.remaining} sur ${expensesResult.total}`);
      console.log(`Revenus restants: ${incomesResult.remaining} sur ${incomesResult.total}`);
      
      // Traitement des budgets pour la transition
      await processEnvelopeTransitions(envelopes);

      // Maintenant, mettons à jour les spent des catégories
      console.log("Mise à jour des catégories après transition");
      const updatedCategories = await resetCategorySpent(categories);
      
      // Mettre à jour l'état local des catégories
      setCategories(updatedCategories);

      toast({
        title: "Transition effectuée",
        description: "Les budgets ont été mis à jour pour le nouveau mois. Les dépenses et revenus récurrents ont été préservés."
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
