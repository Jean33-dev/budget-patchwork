
import { TransitionEnvelope } from "@/types/transition";
import { useTransitionPreferencesSave } from "./transition/useTransitionPreferencesSave";
import { useTransitionPreferencesGet } from "./transition/useTransitionPreferencesGet";

/**
 * Hook principal pour la gestion des préférences de transition
 * Combine les fonctionnalités de sauvegarde et de récupération des préférences
 */
export const useTransitionPreferences = () => {
  // Utiliser les hooks spécialisés
  const { saveTransitionPreferences } = useTransitionPreferencesSave();
  const { getTransitionPreferences } = useTransitionPreferencesGet();

  return {
    saveTransitionPreferences,
    getTransitionPreferences
  };
};
