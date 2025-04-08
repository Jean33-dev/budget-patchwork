
import { useTransitionEnvelopes } from "./useTransitionEnvelopes";
import { useTransitionOptions } from "./useTransitionOptions";
import { useTransitionProcess } from "./useTransitionProcess";

/**
 * Main hook that combines all transition-related functionality
 */
export const useTransition = (onComplete: () => void) => {
  const { envelopes, setEnvelopes } = useTransitionEnvelopes();
  
  const {
    selectedEnvelope,
    showPartialDialog,
    showTransferDialog,
    setSelectedEnvelope,
    setShowPartialDialog,
    setShowTransferDialog,
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleMultiTransferChange
  } = useTransitionOptions(envelopes, setEnvelopes);
  
  const {
    isProcessing,
    progress,
    handleTransitionConfirm
  } = useTransitionProcess(envelopes, onComplete);

  return {
    // Envelope data
    envelopes,
    
    // Dialog state
    selectedEnvelope,
    showPartialDialog,
    showTransferDialog,
    
    // Process state
    isProcessing,
    progress,
    
    // Setters
    setSelectedEnvelope,
    setShowPartialDialog,
    setShowTransferDialog,
    
    // Handlers
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleMultiTransferChange,
    handleTransitionConfirm
  };
};
