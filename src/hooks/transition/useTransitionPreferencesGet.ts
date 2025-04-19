
// Clé de stockage pour les préférences de transition
const TRANSITION_PREFERENCES_KEY = "budget_transition_preferences";

/**
 * Type pour les préférences de transition sauvegardées
 */
export interface SavedTransitionPreference {
  id: string;
  transitionOption: string;
  partialAmount?: number;
  transferTargetId?: string;
  multiTransfers?: { targetId: string; amount: number }[];
}

/**
 * Hook pour la récupération des préférences de transition
 * Responsable uniquement de la lecture des préférences depuis le localStorage
 */
export const useTransitionPreferencesGet = () => {
  /**
   * Récupère les préférences de transition sauvegardées
   * @returns Les préférences de transition ou null si aucune préférence n'est trouvée
   */
  const getTransitionPreferences = (): SavedTransitionPreference[] | null => {
    try {
      const savedPreferences = localStorage.getItem(TRANSITION_PREFERENCES_KEY);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences) as SavedTransitionPreference[];
        console.log("Préférences de transition récupérées:", preferences);
        return preferences;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des préférences de transition:", error);
    }
    return null;
  };

  return {
    getTransitionPreferences
  };
};
