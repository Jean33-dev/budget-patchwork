
import { useState, useCallback } from "react";
import { TransitionEnvelope } from "@/types/transition";

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
 * Hook principal pour la gestion des préférences de transition
 * Combine les fonctionnalités de sauvegarde et de récupération des préférences
 */
export const useTransitionPreferences = () => {
  /**
   * Sauvegarde les préférences de transition pour la prochaine utilisation
   * @param envelopes Les enveloppes budgétaires avec leurs options de transition
   */
  const saveTransitionPreferences = useCallback((envelopes: TransitionEnvelope[]) => {
    try {
      // Filtrer les valeurs invalides ou undefined
      const preferences = envelopes.map(env => {
        // Créer un objet de préférence avec uniquement l'ID et l'option de transition
        const pref: SavedTransitionPreference = {
          id: env.id,
          transitionOption: env.transitionOption,
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
  }, []);

  /**
   * Récupère les préférences de transition sauvegardées
   * @returns Les préférences de transition ou null si aucune préférence n'est trouvée
   */
  const getTransitionPreferences = useCallback((): SavedTransitionPreference[] | null => {
    try {
      const savedPreferences = localStorage.getItem(TRANSITION_PREFERENCES_KEY);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences) as SavedTransitionPreference[];
        return preferences;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des préférences de transition:", error);
    }
    return null;
  }, []);

  /**
   * Applique les préférences sauvegardées aux enveloppes budgétaires
   * @param envelopes Les enveloppes budgétaires initiales
   * @param savedPreferences Les préférences sauvegardées
   * @returns Les enveloppes budgétaires avec les préférences appliquées
   */
  const applyPreferencesToEnvelopes = useCallback(<T extends { id: string; title?: string; transitionOption?: string; transferTargetId?: string; transferTargetTitle?: string; partialAmount?: number; multiTransfers?: any[] }>(
    envelopes: T[],
    savedPreferences: SavedTransitionPreference[] | null
  ): T[] => {
    if (!savedPreferences || savedPreferences.length === 0) {
      return envelopes;
    }

    return envelopes.map(env => {
      const savedPref = savedPreferences.find(pref => pref.id === env.id);
      if (!savedPref) {
        return env;
      }

      // Cloner l'enveloppe pour éviter de modifier l'original
      const updatedEnv = { ...env };

      // Appliquer l'option de transition sauvegardée
      updatedEnv.transitionOption = savedPref.transitionOption as any;

      // Pour les options de transfert, trouver le titre de l'enveloppe cible
      if (savedPref.transitionOption === "transfer" && savedPref.transferTargetId) {
        const targetEnvelope = envelopes.find(e => e.id === savedPref.transferTargetId);
        updatedEnv.transferTargetId = savedPref.transferTargetId;
        updatedEnv.transferTargetTitle = targetEnvelope?.title;
      }

      // Pour les options de montant partiel
      if (savedPref.transitionOption === "partial" && savedPref.partialAmount !== undefined) {
        updatedEnv.partialAmount = savedPref.partialAmount;
      }

      // Pour les options de transferts multiples
      if (savedPref.transitionOption === "multi-transfer" && savedPref.multiTransfers) {
        updatedEnv.multiTransfers = savedPref.multiTransfers.map(transfer => {
          const targetEnvelope = envelopes.find(e => e.id === transfer.targetId);
          return {
            targetId: transfer.targetId,
            targetTitle: targetEnvelope?.title || "Inconnu",
            amount: transfer.amount
          };
        });
      }

      return updatedEnv;
    });
  }, []);

  return {
    saveTransitionPreferences,
    getTransitionPreferences,
    applyPreferencesToEnvelopes
  };
};
