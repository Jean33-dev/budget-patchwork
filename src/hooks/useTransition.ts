
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { useEnvelopeState } from "./transition/useEnvelopeState";
import { useEnvelopeActions } from "./transition/useEnvelopeActions";
import { useTransitionConfirmation } from "./transition/useTransitionConfirmation";

export const useTransition = (onComplete: () => void) => {
  const { budgets } = useBudgets();
  const { handleMonthTransition, getTransitionPreferences } = useCategories();
  
  // Utilise le hook pour gérer l'état des enveloppes
  const {
    envelopes,
    setEnvelopes,
    selectedEnvelope,
    setSelectedEnvelope
  } = useEnvelopeState(budgets, getTransitionPreferences);
  
  // Utilise le hook pour gérer les actions sur les enveloppes
  const {
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleMultiTransferChange
  } = useEnvelopeActions(setEnvelopes);
  
  // Utilise le hook pour gérer la confirmation de transition
  const {
    isProcessing,
    showPartialDialog,
    showTransferDialog,
    setShowPartialDialog,
    setShowTransferDialog,
    handleTransitionConfirm
  } = useTransitionConfirmation(envelopes, handleMonthTransition, onComplete);

  return {
    envelopes,
    selectedEnvelope,
    showPartialDialog,
    showTransferDialog,
    isProcessing,
    setSelectedEnvelope,
    setShowPartialDialog,
    setShowTransferDialog,
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleMultiTransferChange,
    handleTransitionConfirm
  };
};
