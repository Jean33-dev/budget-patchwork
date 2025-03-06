
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

    console.log('Budgets chargés:', budgets.length);
    console.log('Enveloppes initiales:', initialEnvelopes);

    // Load saved preferences if available
    const savedPreferences = getTransitionPreferences();
    console.log('Préférences chargées:', savedPreferences);
    
    if (savedPreferences && savedPreferences.length > 0) {
      // Apply saved preferences to the envelopes
      const updatedEnvelopes = initialEnvelopes.map(env => {
        const savedPref = savedPreferences.find(pref => pref.id === env.id);
        if (savedPref) {
          console.log(`Préférences appliquées pour ${env.id}:`, savedPref.transitionOption);
          return {
            ...env,
            transitionOption: savedPref.transitionOption as TransitionOption,
            transferTargetId: savedPref.transferTargetId,
            partialAmount: savedPref.partialAmount
          };
        }
        return env;
      });
      
      console.log('Enveloppes après préférences:', updatedEnvelopes);
      setEnvelopes(updatedEnvelopes);
    } else {
      console.log('Aucune préférence trouvée, utilisation des valeurs par défaut');
      setEnvelopes(initialEnvelopes);
    }
  }, [budgets, getTransitionPreferences]);

  const handleOptionChange = (envelopeId: string, option: TransitionOption) => {
    console.log(`Changement d'option pour ${envelopeId}:`, option);
    
    // Find the current envelope
    const currentEnvelope = envelopes.find(env => env.id === envelopeId);
    if (!currentEnvelope) return;

    setEnvelopes(prev => 
      prev.map(env => {
        if (env.id === envelopeId) {
          const updatedEnv = { ...env, transitionOption: option };
          if (option !== "partial") delete updatedEnv.partialAmount;
          if (option !== "transfer") {
            delete updatedEnv.transferTargetId;
            delete updatedEnv.transferTargetTitle;
          }
          console.log('Enveloppe mise à jour:', updatedEnv);
          return updatedEnv;
        }
        return env;
      })
    );
    
    // Show the appropriate dialog based on the selected option
    if (option === "transfer") {
      setSelectedEnvelope(currentEnvelope);
      setShowTransferDialog(true);
    } else if (option === "partial") {
      setSelectedEnvelope(currentEnvelope);
      setShowPartialDialog(true);
    }
  };

  const handlePartialAmountChange = (envelopeId: string, amount: number) => {
    setEnvelopes(prev =>
      prev.map(env =>
        env.id === envelopeId
          ? { ...env, partialAmount: amount }
          : env
      )
    );
  };

  const handleTransferTargetChange = (envelopeId: string, targetId: string) => {
    const targetEnvelope = envelopes.find(env => env.id === targetId);
    if (!targetEnvelope) return;

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
    
    console.log(`Cible de transfert définie pour ${envelopeId}: ${targetId} (${targetEnvelope.title})`);
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
