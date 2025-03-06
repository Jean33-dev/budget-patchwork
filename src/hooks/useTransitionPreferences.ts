
import { TransitionEnvelope } from "@/types/transition";

// Local storage key to remember transition preferences
const TRANSITION_PREFERENCES_KEY = "budget_transition_preferences";

export const useTransitionPreferences = () => {
  // Function to save user preferences for the next time
  const saveTransitionPreferences = (envelopes: TransitionEnvelope[]) => {
    try {
      const preferences = envelopes.map(env => ({
        id: env.id,
        transitionOption: env.transitionOption,
        // Save partial amounts for partial option
        partialAmount: env.transitionOption === "partial" ? env.partialAmount : undefined,
        // Only save specific targets for transfer option
        transferTargetId: env.transitionOption === "transfer" ? env.transferTargetId : undefined
      }));
      
      localStorage.setItem(TRANSITION_PREFERENCES_KEY, JSON.stringify(preferences));
      console.log("Préférences de transition sauvegardées:", preferences);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences de transition:", error);
    }
  };

  // Function to get saved preferences
  const getTransitionPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem(TRANSITION_PREFERENCES_KEY);
      if (savedPreferences) {
        return JSON.parse(savedPreferences);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des préférences de transition:", error);
    }
    return null;
  };

  return {
    saveTransitionPreferences,
    getTransitionPreferences
  };
};
