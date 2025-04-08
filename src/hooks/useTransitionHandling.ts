
import { useTransitionPreferences } from "./useTransitionPreferences";
import { useTransitionProcessor } from "./useTransitionProcessor";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { getTransitionPreferences } = useTransitionPreferences();
  const { handleMonthTransition, progress } = useTransitionProcessor(categories, setCategories);

  return {
    handleMonthTransition,
    getTransitionPreferences,
    progress
  };
};
