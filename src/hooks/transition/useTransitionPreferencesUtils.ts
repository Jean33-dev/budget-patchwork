
import { BudgetEnvelope } from "@/types/transition";
import { SavedTransitionPreference } from "./useTransitionPreferencesGet";

/**
 * Utilitaires pour appliquer les préférences sauvegardées aux enveloppes budgétaires
 */
export const useTransitionPreferencesUtils = () => {
  /**
   * Applique les préférences sauvegardées aux enveloppes budgétaires
   * @param envelopes Les enveloppes budgétaires initiales
   * @param savedPreferences Les préférences sauvegardées
   * @returns Les enveloppes budgétaires avec les préférences appliquées
   */
  const applyPreferencesToEnvelopes = (
    envelopes: BudgetEnvelope[],
    savedPreferences: SavedTransitionPreference[] | null
  ): BudgetEnvelope[] => {
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
  };

  return {
    applyPreferencesToEnvelopes
  };
};
