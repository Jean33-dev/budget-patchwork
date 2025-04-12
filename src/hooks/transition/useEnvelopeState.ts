
import { useState, useEffect } from "react";
import { BudgetEnvelope } from "@/types/transition";
import { useTransitionPreferencesUtils } from "./useTransitionPreferencesUtils";
import { SavedTransitionPreference } from "./useTransitionPreferencesGet";

export const useEnvelopeState = (
  budgets: any[],
  getTransitionPreferences: () => SavedTransitionPreference[] | null
) => {
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState<BudgetEnvelope | null>(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  
  // Utiliser le hook d'utilitaires de préférences
  const { applyPreferencesToEnvelopes } = useTransitionPreferencesUtils();

  useEffect(() => {
    // Ne rien faire si aucun budget n'est disponible
    if (budgets.length === 0) return;
    
    // Ne charger les préférences qu'une seule fois
    if (preferencesLoaded) return;
    
    console.log('Initialisation des enveloppes à partir des budgets:', budgets.length);
    
    // Créer les enveloppes de base à partir des budgets
    const initialEnvelopes: BudgetEnvelope[] = budgets.map(budget => {
      const remaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
      
      return {
        id: budget.id,
        title: budget.title,
        budget: budget.budget,
        spent: budget.spent,
        remaining: remaining,
        transitionOption: "reset" // Option par défaut
      };
    });

    // Charger les préférences sauvegardées si disponibles
    const savedPreferences = getTransitionPreferences();
    console.log('Préférences chargées:', savedPreferences);
    
    if (savedPreferences && savedPreferences.length > 0) {
      // Appliquer les préférences sauvegardées aux enveloppes
      const updatedEnvelopes = applyPreferencesToEnvelopes(initialEnvelopes, savedPreferences);
      console.log('Enveloppes après application des préférences:', updatedEnvelopes);
      setEnvelopes(updatedEnvelopes);
    } else {
      console.log('Aucune préférence trouvée, utilisation des valeurs par défaut');
      setEnvelopes(initialEnvelopes);
    }
    
    setPreferencesLoaded(true);
  }, [budgets, getTransitionPreferences, preferencesLoaded, applyPreferencesToEnvelopes]);

  return {
    envelopes,
    setEnvelopes,
    selectedEnvelope,
    setSelectedEnvelope,
    preferencesLoaded
  };
};
