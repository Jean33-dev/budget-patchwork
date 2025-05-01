
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
      
      // Récupérer tous les budgets pour analyse AVANT modification
      console.log("DEBUG: Récupération de l'état actuel des budgets AVANT toute modification");
      const { db } = await import('@/services/database');
      const allBudgets = await db.getBudgets();
      const dashboardBudgets = allBudgets.filter(b => 
        String(b.dashboardId || '') === String(currentDashboardId || '')
      );
      console.log("DEBUG: État initial des budgets:");
      dashboardBudgets.forEach(b => {
        console.log(`Budget ${b.id} (${b.title}): budget=${b.budget}, carriedOver=${b.carriedOver || 0}, spent=${b.spent}, total disponible=${b.budget + (b.carriedOver || 0)}, reste=(${b.budget + (b.carriedOver || 0)} - ${b.spent})=${(b.budget + (b.carriedOver || 0)) - b.spent}`);
      });
      
      // ÉTAPE 1: Calcul des montants à reporter AVANT toute modification
      console.log("ÉTAPE 1: Pré-calcul des montants à reporter avant toute modification");
      const transitionPlan = await calculateTransitionAmounts(envelopes, currentDashboardId);
      
      // Amélioration du log pour diagnostic
      console.log("Plan de transition calculé en détail:");
      for (const [id, plan] of transitionPlan.entries()) {
        console.log(`Budget ${id} (${plan.title || 'Sans titre'}):`);
        console.log(`  Budget initial: ${plan.initialBudget || 0}`);
        console.log(`  Report précédent: ${plan.previousCarriedOver || 0}`);
        console.log(`  Total disponible: ${plan.initialBudget + plan.previousCarriedOver}`);
        console.log(`  Dépensé: ${plan.spent || 0}`);
        console.log(`  Formule de calcul: (${plan.initialBudget} + ${plan.previousCarriedOver}) - ${plan.spent}`);
        console.log(`  Montant restant calculé: ${plan.remainingAmount}`);
        console.log(`  Option: ${plan.option}`);
      }
      
      // ÉTAPE 2: Traitement des budgets pour la transition
      console.log("ÉTAPE 2: Application des transitions sur les budgets");
      await processEnvelopeTransitions(envelopes, currentDashboardId);
      
      // Vérification de l'état intermédiaire après transition des budgets
      console.log("DEBUG: Vérification de l'état des budgets APRÈS application des transitions");
      const budgetsAfterTransition = await db.getBudgets();
      const dashboardBudgetsAfterTransition = budgetsAfterTransition.filter(b => 
        String(b.dashboardId || '') === String(currentDashboardId || '')
      );
      console.log("DEBUG: État intermédiaire des budgets après transition:");
      dashboardBudgetsAfterTransition.forEach(b => {
        console.log(`Budget ${b.id} (${b.title}): budget=${b.budget}, carriedOver=${b.carriedOver || 0}, spent=${b.spent}`);
      });
      
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
      
      // Vérification finale
      console.log("DEBUG: Vérification FINALE de l'état des budgets");
      const finalBudgets = await db.getBudgets();
      const dashboardFinalBudgets = finalBudgets.filter(b => 
        String(b.dashboardId || '') === String(currentDashboardId || '')
      );
      console.log("DEBUG: État final des budgets:");
      dashboardFinalBudgets.forEach(b => {
        console.log(`Budget ${b.id} (${b.title}): budget=${b.budget}, carriedOver=${b.carriedOver || 0}, spent=${b.spent}`);
        
        // Vérifier si ce budget était dans le plan de transition
        const budgetPlan = Array.from(transitionPlan.values()).find(plan => plan.budgetId === b.id);
        if (budgetPlan) {
          console.log(`  Comparaison avec le plan: montant restant calculé=${budgetPlan.remainingAmount}, carriedOver final=${b.carriedOver || 0}`);
          if (budgetPlan.option === 'carry' && budgetPlan.remainingAmount !== b.carriedOver) {
            console.log(`  ⚠️ ANOMALIE: Le report final (${b.carriedOver}) ne correspond pas au montant restant calculé (${budgetPlan.remainingAmount})`);
          }
        }
      });

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
