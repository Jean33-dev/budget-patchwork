
// Définition du type pour les préférences de transition sauvegardées
export interface SavedTransitionPreference {
  id: string;
  transitionOption: string;
  partialAmount?: number;
  transferTargetId?: string;
  multiTransfers?: { targetId: string; amount: number }[];
}

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/services/database";

/**
 * Hook pour la récupération des préférences de transition
 * Utilise SQLite au lieu de localStorage
 */
export const useTransitionPreferencesGet = () => {
  // Fonction asynchrone pour récupérer les préférences depuis SQLite
  const fetchTransitionPreferences = useCallback(async () => {
    try {
      // S'assurer que la base de données est initialisée
      const initialized = await db.init();
      if (!initialized) {
        console.error("La base de données n'a pas pu être initialisée");
        return null;
      }
      
      // Utiliser le service transitional_preferences pour récupérer les préférences
      const preferences = await db.getTransitionPreferences();
      console.log("Préférences de transition récupérées:", preferences);
      return preferences;
    } catch (error) {
      console.error("Erreur lors de la récupération des préférences de transition:", error);
      return null;
    }
  }, []);

  // Utiliser React Query pour gérer le cache et l'état de chargement
  const { data: preferences } = useQuery({
    queryKey: ['transitionPreferences'],
    queryFn: fetchTransitionPreferences
  });

  /**
   * Récupère les préférences de transition sauvegardées
   * @returns Les préférences de transition ou null si aucune préférence n'est trouvée
   */
  const getTransitionPreferences = useCallback(() => {
    return preferences;
  }, [preferences]);

  return {
    getTransitionPreferences
  };
};
