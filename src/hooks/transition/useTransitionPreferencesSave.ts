
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook pour la sauvegarde des préférences de transition
 * Utilise SQLite au lieu de localStorage
 */
export const useTransitionPreferencesSave = () => {
  const queryClient = useQueryClient();
  
  // Mutation pour sauvegarder les préférences
  const { mutate: savePreferencesMutation } = useMutation({
    mutationFn: async (envelopes: TransitionEnvelope[]) => {
      try {
        // S'assurer que la base de données est initialisée
        const initialized = await db.init();
        if (!initialized) {
          throw new Error("La base de données n'a pas pu être initialisée");
        }
        
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
        
        // Enregistrer les préférences dans SQLite
        const saved = await db.saveTransitionPreferences(preferences);
        if (!saved) {
          throw new Error("Erreur lors de la sauvegarde des préférences");
        }
        
        console.log("Préférences de transition sauvegardées:", preferences);
        return true;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des préférences de transition:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalider la requête pour forcer une mise à jour des données
      queryClient.invalidateQueries({ queryKey: ['transitionPreferences'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences de transition"
      });
      console.error("Erreur mutation:", error);
    }
  });

  /**
   * Sauvegarde les préférences de transition pour la prochaine utilisation
   * @param envelopes Les enveloppes budgétaires avec leurs options de transition
   */
  const saveTransitionPreferences = useCallback((envelopes: TransitionEnvelope[]) => {
    savePreferencesMutation(envelopes);
  }, [savePreferencesMutation]);

  return {
    saveTransitionPreferences
  };
};
