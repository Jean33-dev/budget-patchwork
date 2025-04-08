
import { useState, useEffect } from "react";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { toast } from "sonner";

export const useTransition = (onComplete: () => void) => {
  const { budgets } = useBudgets();
  const { handleMonthTransition, getTransitionPreferences } = useCategories();
  
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState<BudgetEnvelope | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [progress, setProgress] = useState<{ step: string; percentage: number } | null>(null);

  useEffect(() => {
    // Map budgets to envelopes format
    if (budgets.length === 0) return;
    
    // Only initialize once
    if (preferencesLoaded) return;
    
    console.log('Initializing envelopes from budgets:', budgets.length);
    
    // Create base envelopes from budgets
    const initialEnvelopes: BudgetEnvelope[] = budgets.map(budget => {
      const remaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
      
      return {
        id: budget.id,
        title: budget.title,
        budget: budget.budget,
        spent: budget.spent,
        remaining: remaining,
        transitionOption: "reset" // Default option
      };
    });

    // Load saved preferences if available
    const savedPreferences = getTransitionPreferences();
    console.log('Preferences loaded:', savedPreferences);
    
    if (savedPreferences && savedPreferences.length > 0) {
      // Apply saved preferences to the envelopes
      const updatedEnvelopes = initialEnvelopes.map(env => {
        const savedPref = savedPreferences.find(pref => pref.id === env.id);
        if (savedPref) {
          console.log(`Applying preferences for ${env.id}:`, savedPref.transitionOption);
          
          // For transfer options, we need to find the target envelope name
          let transferTargetTitle;
          if (savedPref.transitionOption === "transfer" && savedPref.transferTargetId) {
            const targetEnvelope = initialEnvelopes.find(e => e.id === savedPref.transferTargetId);
            transferTargetTitle = targetEnvelope?.title;
          }
          
          // For multi-transfer options, we need to find the target envelope names
          let multiTransfers;
          if (savedPref.transitionOption === "multi-transfer" && savedPref.multiTransfers) {
            multiTransfers = savedPref.multiTransfers.map(transfer => {
              const targetEnvelope = initialEnvelopes.find(e => e.id === transfer.targetId);
              return {
                targetId: transfer.targetId,
                targetTitle: targetEnvelope?.title || "Unknown",
                amount: transfer.amount
              };
            });
          }
          
          return {
            ...env,
            transitionOption: savedPref.transitionOption as TransitionOption,
            transferTargetId: savedPref.transferTargetId,
            transferTargetTitle,
            partialAmount: savedPref.partialAmount,
            multiTransfers
          };
        }
        return env;
      });
      
      console.log('Envelopes after applying preferences:', updatedEnvelopes);
      setEnvelopes(updatedEnvelopes);
    } else {
      console.log('No preferences found, using default values');
      setEnvelopes(initialEnvelopes);
    }
    
    setPreferencesLoaded(true);
  }, [budgets, getTransitionPreferences, preferencesLoaded]);

  const handleOptionChange = (envelopeId: string, option: TransitionOption) => {
    console.log(`handleOptionChange for ${envelopeId} to:`, option);
    
    setEnvelopes(prevEnvelopes => {
      const updatedEnvelopes = prevEnvelopes.map(env => {
        if (env.id === envelopeId) {
          console.log(`Updating envelope ${env.id} from ${env.transitionOption} to ${option}`);
          
          // Create a new envelope object with the updated option
          const updatedEnv = { 
            ...env, 
            transitionOption: option 
          };
          
          // Clear related fields if changing away from that option
          if (option !== "partial") {
            delete updatedEnv.partialAmount;
          }
          
          if (option !== "transfer") {
            delete updatedEnv.transferTargetId;
            delete updatedEnv.transferTargetTitle;
          }
          
          if (option !== "multi-transfer") {
            delete updatedEnv.multiTransfers;
          }
          
          console.log('Updated envelope:', updatedEnv);
          return updatedEnv;
        }
        return env;
      });
      
      console.log('All envelopes after update:', updatedEnvelopes);
      return updatedEnvelopes;
    });
  };

  const handlePartialAmountChange = (envelopeId: string, amount: number) => {
    console.log(`Partial amount changed for ${envelopeId}:`, amount);
    
    setEnvelopes(prev =>
      prev.map(env =>
        env.id === envelopeId
          ? { ...env, partialAmount: amount }
          : env
      )
    );
  };

  const handleTransferTargetChange = (envelopeId: string, targetId: string) => {
    console.log(`Transfer target changed for ${envelopeId}:`, targetId);
    
    const targetEnvelope = envelopes.find(env => env.id === targetId);
    if (!targetEnvelope) {
      console.error('Target envelope not found:', targetId);
      return;
    }

    setEnvelopes(prev =>
      prev.map(env =>
        env.id === envelopeId
          ? { 
              ...env, 
              transferTargetId: targetId,
              transferTargetTitle: targetEnvelope.title
            }
          : env
      )
    );
    
    console.log(`Transfer target set for ${envelopeId}: ${targetId} (${targetEnvelope.title})`);
  };
  
  const handleMultiTransferChange = (envelopeId: string, transfers: { targetId: string; targetTitle: string; amount: number }[]) => {
    console.log(`Multi-transfer changed for ${envelopeId}:`, transfers);
    
    setEnvelopes(prev =>
      prev.map(env =>
        env.id === envelopeId
          ? { ...env, multiTransfers: transfers }
          : env
      )
    );
  };

  const handleTransitionConfirm = async () => {
    setIsProcessing(true);
    setProgress({ step: "Démarrage", percentage: 5 });
    
    try {
      // Verify all transfer options have a target
      const missingTargets = envelopes.filter(
        env => env.transitionOption === "transfer" && !env.transferTargetId
      );
      
      if (missingTargets.length > 0) {
        toast.error("Certains transferts n'ont pas de budget cible");
        setIsProcessing(false);
        setProgress(null);
        return;
      }
      
      // Verify all multi-transfer options have at least one target
      const missingMultiTargets = envelopes.filter(
        env => env.transitionOption === "multi-transfer" && (!env.multiTransfers || env.multiTransfers.length === 0)
      );
      
      if (missingMultiTargets.length > 0) {
        toast.error("Certains transferts multiples n'ont pas de cibles");
        setIsProcessing(false);
        setProgress(null);
        return;
      }
      
      // Convert budget envelopes to transition envelopes format expected by the hook
      const transitionData = envelopes.map(env => ({
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
      
      console.log('Sending transition data:', transitionData);
      
      // Monitor progress updates from the useTransitionProcessor
      const progressInterval = setInterval(() => {
        // This will be updated by the child hook
      }, 500);
      
      const success = await handleMonthTransition(transitionData);
      
      clearInterval(progressInterval);
      
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
    envelopes,
    selectedEnvelope,
    showPartialDialog,
    showTransferDialog,
    isProcessing,
    progress,
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
