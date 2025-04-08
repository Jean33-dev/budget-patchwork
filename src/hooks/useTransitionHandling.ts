
import { useState, useEffect, useCallback } from "react";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { useTransitionProcessor } from "./useTransitionProcessor";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { getTransitionPreferences } = useTransitionPreferences();
  const { handleMonthTransition, progress: processorProgress } = useTransitionProcessor(categories, setCategories);
  const [progress, setProgress] = useState<{ step: string; percentage: number } | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Track progress changes from the processor
  useEffect(() => {
    if (processorProgress) {
      console.log("useTransitionHandling received progress update:", processorProgress);
      setProgress(processorProgress);
    }
  }, [processorProgress]);

  // Wrapper pour handleMonthTransition avec meilleure gestion des erreurs
  const handleTransition = useCallback(async (envelopes: any[]) => {
    try {
      if (isInitializing) {
        console.log("Initialisation de la base de données en cours, traitement en attente...");
        return false;
      }
      
      setIsInitializing(true);
      const result = await handleMonthTransition(envelopes);
      setIsInitializing(false);
      return result;
    } catch (error) {
      console.error("Erreur attrapée dans useTransitionHandling:", error);
      setIsInitializing(false);
      throw error; // Propager l'erreur pour la gestion dans useTransitionProcess
    }
  }, [handleMonthTransition, isInitializing]);

  return {
    handleMonthTransition: handleTransition,
    getTransitionPreferences,
    progress
  };
};
