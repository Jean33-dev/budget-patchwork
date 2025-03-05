
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
    if (savedPreferences) {
      // Apply saved preferences to the envelopes
      setEnvelopes(
        initialEnvelopes.map(env => {
          const savedPref = savedPreferences.find(pref => pref.id === env.id);
          if (savedPref) {
            return {
              ...env,
              transitionOption: savedPref.transitionOption as TransitionOption,
              transferTargetId: savedPref.transferTargetId
            };
          }
          return env;
        })
      );
    } else {
      setEnvelopes(initialEnvelopes);
    }
  }, [budgets, getTransitionPreferences]);

  const handleOptionChange = (envelopeId: string, option: TransitionOption) => {
    setEnvelopes(prev => 
      prev.map(env => {
        if (env.id === envelopeId) {
          const updatedEnv = { ...env, transitionOption: option };
          if (option !== "partial") delete updatedEnv.partialAmount;
          if (option !== "transfer") delete updatedEnv.transferTargetId;
          return updatedEnv;
        }
        return env;
      })
    );

    const envelope = envelopes.find(env => env.id === envelopeId);
    if (envelope) {
      setSelectedEnvelope(envelope);
      if (option === "partial") {
        setShowPartialDialog(true);
      } else if (option === "transfer") {
        setShowTransferDialog(true);
      }
    }
  };

  const handlePartialAmountChange = (amount: number) => {
    if (!selectedEnvelope) return;
    
    setEnvelopes(prev =>
      prev.map(env =>
        env.id === selectedEnvelope.id
          ? { ...env, partialAmount: amount }
          : env
      )
    );
  };

  const handleTransferTargetChange = (targetId: string) => {
    if (!selectedEnvelope) return;
    
    const targetEnvelope = envelopes.find(env => env.id === targetId);
    if (!targetEnvelope) return;

    setEnvelopes(prev =>
      prev.map(env =>
        env.id === selectedEnvelope.id
          ? { 
              ...env, 
              transferTargetId: targetId,
              transferTargetTitle: targetEnvelope.title
            }
          : env
      )
    );
  };

  const handleTransitionConfirm = async () => {
    setIsProcessing(true);
    
    try {
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
    setShowPartialDialog,
    setShowTransferDialog,
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleTransitionConfirm
  };
};
