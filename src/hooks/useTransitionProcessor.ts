
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { useBudgetTransitioner } from "./transition/useBudgetTransitioner";
import { useExpenseIncomeReset } from "./transition/useExpenseIncomeReset";
import { useDashboardContext } from "./useDashboardContext";

export const useTransitionProcessor = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const { currentDashboardId } = useDashboardContext();
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
      if (!currentDashboardId) {
        console.error("Transition impossible : aucun dashboard sélectionné");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'effectuer la transition sans dashboard sélectionné."
        });
        return false;
      }
      
      console.log(`Transition de mois pour le dashboard: ${currentDashboardId}`);
      
      // Save preferences for next time
      saveTransitionPreferences(envelopes);
      
      // Réinitialiser les dépenses non récurrentes du dashboard courant uniquement
      const expensesResult = await resetNonRecurringExpenses(currentDashboardId);
      
      // Réinitialiser les revenus non récurrents du dashboard courant uniquement
      const incomesResult = await resetNonRecurringIncomes(currentDashboardId);
      
      console.log("Vérification après suppression sélective:");
      console.log(`Dépenses restantes: ${expensesResult.remaining} sur ${expensesResult.total}`);
      console.log(`Revenus restants: ${incomesResult.remaining} sur ${incomesResult.total}`);
      
      // Traitement des budgets pour la transition (uniquement pour le dashboard courant)
      await processEnvelopeTransitions(envelopes, currentDashboardId);

      // Maintenant, mettons à jour les spent des catégories du dashboard courant uniquement
      console.log("Mise à jour des catégories après transition");
      const updatedCategories = await resetCategorySpent(categories, currentDashboardId);
      
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
