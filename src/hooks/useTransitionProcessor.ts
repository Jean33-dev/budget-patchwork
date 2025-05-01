
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
  const { processEnvelopeTransitions, calculateTransitionAmounts } = useBudgetTransitioner();
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
      console.log("Début de la transition avec séquence améliorée");
      
      // Save preferences for next time
      saveTransitionPreferences(envelopes);
      
      // ÉTAPE 1: Calcul des montants à reporter AVANT toute modification
      console.log("ÉTAPE 1: Pré-calcul des montants à reporter avant toute modification");
      // Utiliser la nouvelle fonction mais sans rien faire avec pour le moment - le processEnvelopeTransitions l'utilisera
      await calculateTransitionAmounts(envelopes, currentDashboardId);
      
      // ÉTAPE 2: Traitement des budgets pour la transition
      console.log("ÉTAPE 2: Application des transitions sur les budgets");
      await processEnvelopeTransitions(envelopes, currentDashboardId);
      
      // ÉTAPE 3: Réinitialisation des dépenses non récurrentes APRÈS les calculs et reports
      console.log("ÉTAPE 3: Réinitialisation des dépenses non récurrentes");
      const expensesResult = await resetNonRecurringExpenses(currentDashboardId);
      
      // ÉTAPE 4: Réinitialisation des revenus non récurrents APRÈS les calculs et reports
      console.log("ÉTAPE 4: Réinitialisation des revenus non récurrents");
      const incomesResult = await resetNonRecurringIncomes(currentDashboardId);
      
      console.log("Vérification après suppression sélective:");
      console.log(`Dépenses restantes: ${expensesResult.remaining} sur ${expensesResult.total}`);
      console.log(`Revenus restants: ${incomesResult.remaining} sur ${incomesResult.total}`);
      
      // ÉTAPE 5: Mise à jour des montants dépensés dans les catégories
      console.log("ÉTAPE 5: Mise à jour des catégories après transition");
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
