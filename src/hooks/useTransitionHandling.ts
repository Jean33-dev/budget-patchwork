
import { useState, useEffect, useCallback } from "react";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { useTransitionProcessor } from "./useTransitionProcessor";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { getTransitionPreferences } = useTransitionPreferences();
  const { handleMonthTransition, progress: processorProgress } = useTransitionProcessor(categories, setCategories);
  const [progress, setProgress] = useState<{ step: string; percentage: number } | null>(null);

  // Track progress changes from the processor
  useEffect(() => {
    if (processorProgress) {
      console.log("useTransitionHandling received progress update:", processorProgress);
      setProgress(processorProgress);
    }
  }, [processorProgress]);

  return {
    handleMonthTransition,
    getTransitionPreferences,
    progress
  };
};
