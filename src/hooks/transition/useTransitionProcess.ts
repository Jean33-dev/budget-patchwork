
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
   * Nettoie les données et supprime les objets undefined mal formés
   */
  const cleanUndefinedValues = (value: any): any => {
    if (value === null || value === undefined) {
      return undefined;
    }
    
    // Détecte et nettoie les objets qui représentent des valeurs undefined
    if (typeof value === 'object' && value._type === 'undefined') {
      return undefined;
    }
    
    // Traite les tableaux récursivement
    if (Array.isArray(value)) {
      return value.map(item => cleanUndefinedValues(item));
    }
    
    // Traite les objets récursivement
    if (typeof value === 'object' && value !== null) {
      const cleanedObj: any = {};
      Object.keys(value).forEach(key => {
        const cleanedValue = cleanUndefinedValues(value[key]);
        if (cleanedValue !== undefined) {
          cleanedObj[key] = cleanedValue;
        }
      });
      return cleanedObj;
    }
    
    return value;
  };

  /**
   * Prepares transition data from envelopes
   */
  const prepareTransitionData = (envelopes: any[]): TransitionEnvelope[] => {
    return envelopes.map(env => {
      // Clean up the envelope data
      const cleanedEnv = cleanUndefinedValues(env);
      
      return {
        id: cleanedEnv.id,
        title: cleanedEnv.title,
        transitionOption: cleanedEnv.transitionOption,
        partialAmount: cleanedEnv.partialAmount,
        transferTargetId: cleanedEnv.transferTargetId,
        multiTransfers: Array.isArray(cleanedEnv.multiTransfers) ? 
          cleanedEnv.multiTransfers.map(t => ({
            targetId: t.targetId,
            amount: t.amount
          })) : undefined
      };
    });
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
      // Prepare transition data with proper cleaning of undefined values
      const transitionData = prepareTransitionData(envelopes);
      
      // Log the cleaned data for debugging
      console.log('Données de transition nettoyées:', transitionData);
      
      // Validate transition requirements
      const validation = validateTransition(transitionData);
      if (!validation.valid) {
        toast.error(validation.message);
        setIsProcessing(false);
        setProgress(null);
        return;
      }
      
      // Add progressive updates for better user feedback
      setProgress({ step: "Validation des données", percentage: 15 });
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI to update
      
      setProgress({ step: "Préparation de la transition", percentage: 30 });
      console.log('Envoi des données de transition:', transitionData);
      
      try {
        // Execute the transition with timeout protection
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("La transition a pris trop de temps")), 30000);
        });
        
        const transitionPromise = handleMonthTransition(transitionData);
        
        // Race between the actual operation and the timeout
        const success = await Promise.race([transitionPromise, timeoutPromise]) as boolean;
        
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
      } catch (transitionError) {
        console.error("Erreur pendant l'exécution de la transition:", transitionError);
        toast.error(`Erreur pendant la transition: ${transitionError instanceof Error ? transitionError.message : 'Erreur inconnue'}`);
        setProgress(null);
      }
    } catch (error) {
      console.error("Erreur détaillée lors de la transition:", error);
      toast.error("Une erreur est survenue lors de la transition");
      setProgress(null);
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
