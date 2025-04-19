
import { TransitionEnvelope } from "@/types/transition";

// Clé de stockage pour les préférences de transition
const TRANSITION_PREFERENCES_KEY = "budget_transition_preferences";

/**
 * Hook pour la sauvegarde des préférences de transition
 * Responsable uniquement de l'enregistrement des préférences dans le localStorage
 */
export const useTransitionPreferencesSave = () => {
  /**
   * Sauvegarde les préférences de transition pour la prochaine utilisation
   * @param envelopes Les enveloppes budgétaires avec leurs options de transition
   */
  const saveTransitionPreferences = (envelopes: TransitionEnvelope[]) => {
    try {
      // Filtrer les valeurs invalides ou undefined
      const preferences = envelopes.map(env => {
        // Créer un objet de préférence avec uniquement l'ID et l'option de transition
        const pref = {
          id: env.id,
          transitionOption: env.transitionOption,
          partialAmount: undefined as number | undefined,
          transferTargetId: undefined as string | undefined,
          multiTransfers: undefined as { targetId: string; amount: number }[] | undefined
        };
        
        // Inclure uniquement les champs pertinents selon l'option choisie
        if (env.transitionOption === "partial" && env.partialAmount !== undefined) {
          pref.partialAmount = env.partialAmount;
        }
        
        if (env.transitionOption === "transfer" && env.transferTargetId) {
          pref.transferTargetId = env.transferTargetId;
        }
        
        if (env.transitionOption === "multi-transfer" && env.multiTransfers) {
          pref.multiTransfers = env.multiTransfers;
        }
        
        return pref;
      });
      
      // Enregistrer les préférences dans le localStorage
      localStorage.setItem(TRANSITION_PREFERENCES_KEY, JSON.stringify(preferences));
      console.log("Préférences de transition sauvegardées:", preferences);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences de transition:", error);
    }
  };

  return {
    saveTransitionPreferences
  };
};
