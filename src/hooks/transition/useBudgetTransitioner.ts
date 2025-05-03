
import { TransitionEnvelope } from "@/types/transition";
import { calculateTransitionAmounts } from "./utils/transitionCalculator";
import { processEnvelopeTransitions } from "./utils/transitionProcessor";

/**
 * Hook pour gérer la transition des budgets d'un mois à l'autre
 */
export const useBudgetTransitioner = () => {
  return {
    calculateTransitionAmounts,
    processEnvelopeTransitions
  };
};
