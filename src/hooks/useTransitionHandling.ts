
import { useState, useEffect } from "react";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { useTransitionProcessor } from "./useTransitionProcessor";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { getTransitionPreferences } = useTransitionPreferences();
  const { handleMonthTransition, progress: processorProgress } = useTransitionProcessor(categories, setCategories);
  const [progress, setProgress] = useState<{ step: string; percentage: number } | null>(null);

  // Surveiller les changements de progression du processeur de transition
  useEffect(() => {
    if (processorProgress) {
      setProgress(processorProgress);
    }
  }, [processorProgress]);

  return {
    handleMonthTransition,
    getTransitionPreferences,
    progress
  };
};
