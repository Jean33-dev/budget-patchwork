
import { TransitionEnvelope } from "@/types/transition";

// Local storage key to remember transition preferences
const TRANSITION_PREFERENCES_KEY = "budget_transition_preferences";

export const useTransitionPreferences = () => {
  // Function to save user preferences for the next time
  const saveTransitionPreferences = (envelopes: TransitionEnvelope[]) => {
    try {
      // Make sure to filter out any undefined or invalid values
      const preferences = envelopes.map(env => {
        const pref = {
          id: env.id,
          transitionOption: env.transitionOption,
          partialAmount: undefined as number | undefined,
          transferTargetId: undefined as string | undefined
        };
        
        // Only include relevant fields based on the option
        if (env.transitionOption === "partial" && env.partialAmount !== undefined) {
          pref.partialAmount = env.partialAmount;
        }
        
        if (env.transitionOption === "transfer" && env.transferTargetId) {
          pref.transferTargetId = env.transferTargetId;
        }
        
        return pref;
      });
      
      localStorage.setItem(TRANSITION_PREFERENCES_KEY, JSON.stringify(preferences));
      console.log("Transition preferences saved:", preferences);
    } catch (error) {
      console.error("Error saving transition preferences:", error);
    }
  };

  // Function to get saved preferences
  const getTransitionPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem(TRANSITION_PREFERENCES_KEY);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        console.log("Retrieved transition preferences:", preferences);
        return preferences;
      }
    } catch (error) {
      console.error("Error retrieving transition preferences:", error);
    }
    return null;
  };

  return {
    saveTransitionPreferences,
    getTransitionPreferences
  };
};
