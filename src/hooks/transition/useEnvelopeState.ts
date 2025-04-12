
import { useState, useEffect } from "react";
import { BudgetEnvelope } from "@/types/transition";

export const useEnvelopeState = (budgets: any[], getTransitionPreferences: () => any) => {
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState<BudgetEnvelope | null>(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

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
            transitionOption: savedPref.transitionOption,
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

  return {
    envelopes,
    setEnvelopes,
    selectedEnvelope,
    setSelectedEnvelope,
    preferencesLoaded
  };
};
