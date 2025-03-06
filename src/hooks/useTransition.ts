
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

  useEffect(() => {
    // Map budgets to envelopes format
    if (budgets.length === 0) return;
    
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

    console.log('Budgets loaded:', budgets.length);
    console.log('Initial envelopes:', initialEnvelopes);

    // Load saved preferences if available
    const savedPreferences = getTransitionPreferences();
    console.log('Preferences loaded:', savedPreferences);
    
    if (savedPreferences && savedPreferences.length > 0) {
      // Apply saved preferences to the envelopes
      const updatedEnvelopes = initialEnvelopes.map(env => {
        const savedPref = savedPreferences.find(pref => pref.id === env.id);
        if (savedPref) {
          console.log(`Preferences applied for ${env.id}:`, savedPref.transitionOption);
          
          // For transfer options, we need to find the target envelope name
          let transferTargetTitle;
          if (savedPref.transitionOption === "transfer" && savedPref.transferTargetId) {
            const targetEnvelope = initialEnvelopes.find(e => e.id === savedPref.transferTargetId);
            transferTargetTitle = targetEnvelope?.title;
          }
          
          return {
            ...env,
            transitionOption: savedPref.transitionOption as TransitionOption,
            transferTargetId: savedPref.transferTargetId,
            transferTargetTitle,
            partialAmount: savedPref.partialAmount
          };
        }
        return env;
      });
      
      console.log('Envelopes after preferences:', updatedEnvelopes);
      setEnvelopes(updatedEnvelopes);
    } else {
      console.log('No preferences found, using default values');
      setEnvelopes(initialEnvelopes);
    }
  }, [budgets, getTransitionPreferences]);

  const handleOptionChange = (envelopeId: string, option: TransitionOption) => {
    console.log(`Option change for ${envelopeId}:`, option);
    
    setEnvelopes(prev => 
      prev.map(env => {
        if (env.id === envelopeId) {
          // Create a new envelope object with the updated option
          const updatedEnv = { ...env, transitionOption: option };
          
          // Clear related fields if changing away from that option
          if (option !== "partial") delete updatedEnv.partialAmount;
          if (option !== "transfer") {
            delete updatedEnv.transferTargetId;
            delete updatedEnv.transferTargetTitle;
          }
          
          console.log('Updated envelope:', updatedEnv);
          return updatedEnv;
        }
        return env;
      })
    );
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

  const handleTransitionConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Verify all transfer options have a target
      const missingTargets = envelopes.filter(
        env => env.transitionOption === "transfer" && !env.transferTargetId
      );
      
      if (missingTargets.length > 0) {
        toast.error("Certains transferts n'ont pas de budget cible");
        setIsProcessing(false);
        return;
      }
      
      // Convert budget envelopes to transition envelopes format expected by the hook
      const transitionData = envelopes.map(env => ({
        id: env.id,
        title: env.title,
        transitionOption: env.transitionOption,
        partialAmount: env.partialAmount,
        transferTargetId: env.transferTargetId
      }));
      
      const success = await handleMonthTransition(transitionData);
      
      if (success) {
        toast.success("Transition effectuée avec succès");
        onComplete();
      } else {
        toast.error("Échec de la transition");
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
    setSelectedEnvelope,
    setShowPartialDialog,
    setShowTransferDialog,
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleTransitionConfirm
  };
};
