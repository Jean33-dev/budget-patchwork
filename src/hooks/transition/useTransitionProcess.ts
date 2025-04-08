
import { useState } from "react";
import { toast } from "sonner";
import { TransitionEnvelope } from "@/types/transition";
import { useCategories } from "../useCategories";

/**
 * Validation functions for transition process
 */
const transitionValidators = {
  /**
   * Validates transfer targets are set for all transfer options
   */
  validateTransferTargets: (envelopes: TransitionEnvelope[]): { valid: boolean; message?: string } => {
    const missingTargets = envelopes.filter(
      env => env.transitionOption === "transfer" && !env.transferTargetId
    );
    
    if (missingTargets.length > 0) {
      return { 
        valid: false, 
        message: "Certains transferts n'ont pas de budget cible" 
      };
    }
    
    return { valid: true };
  },
  
  /**
   * Validates multi-transfer targets are set for all multi-transfer options
   */
  validateMultiTransferTargets: (envelopes: TransitionEnvelope[]): { valid: boolean; message?: string } => {
    const missingMultiTargets = envelopes.filter(
      env => env.transitionOption === "multi-transfer" && 
      (!env.multiTransfers || env.multiTransfers.length === 0)
    );
    
    if (missingMultiTargets.length > 0) {
      return { 
        valid: false, 
        message: "Certains transferts multiples n'ont pas de cibles" 
      };
    }
    
    return { valid: true };
  }
};

/**
 * Hook to manage the transition process execution with improved error handling and flow
 */
export const useTransitionProcess = (
  envelopes: any[],
  onComplete: () => void
) => {
  const { handleMonthTransition } = useCategories();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ step: string; percentage: number } | null>(null);

  /**
   * Prepares transition data from envelopes
   */
  const prepareTransitionData = (envelopes: any[]): TransitionEnvelope[] => {
    return envelopes.map(env => ({
      id: env.id,
      title: env.title,
      transitionOption: env.transitionOption,
      partialAmount: env.partialAmount,
      transferTargetId: env.transferTargetId,
      multiTransfers: env.multiTransfers?.map(t => ({
        targetId: t.targetId,
        amount: t.amount
      }))
    }));
  };

  /**
   * Validates all transition requirements before proceeding
   */
  const validateTransition = (envelopes: TransitionEnvelope[]): { valid: boolean; message?: string } => {
    // Validate transfer targets
    const transferValidation = transitionValidators.validateTransferTargets(envelopes);
    if (!transferValidation.valid) {
      return transferValidation;
    }
    
    // Validate multi-transfer targets
    const multiTransferValidation = transitionValidators.validateMultiTransferTargets(envelopes);
    if (!multiTransferValidation.valid) {
      return multiTransferValidation;
    }
    
    return { valid: true };
  };

  /**
   * Handles the transition process with proper error handling and progress tracking
   */
  const handleTransitionConfirm = async () => {
    setIsProcessing(true);
    setProgress({ step: "Démarrage", percentage: 5 });
    
    try {
      // Prepare transition data
      const transitionData = prepareTransitionData(envelopes);
      
      // Validate transition requirements
      const validation = validateTransition(transitionData);
      if (!validation.valid) {
        toast.error(validation.message);
        setIsProcessing(false);
        setProgress(null);
        return;
      }
      
      console.log('Sending transition data:', transitionData);
      
      const success = await handleMonthTransition(transitionData);
      
      if (success) {
        setProgress({ step: "Terminé", percentage: 100 });
        toast.success("Transition effectuée avec succès");
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        toast.error("Échec de la transition");
        setProgress(null);
      }
    } catch (error) {
      console.error("Erreur lors de la transition:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    progress,
    handleTransitionConfirm
  };
};
