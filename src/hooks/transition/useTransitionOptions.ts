
import { useState } from "react";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";

/**
 * Hook to manage transition options and user selections
 */
export const useTransitionOptions = (
  envelopes: BudgetEnvelope[],
  setEnvelopes: React.Dispatch<React.SetStateAction<BudgetEnvelope[]>>
) => {
  const [selectedEnvelope, setSelectedEnvelope] = useState<BudgetEnvelope | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

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

  return {
    selectedEnvelope,
    showPartialDialog,
    showTransferDialog,
    setSelectedEnvelope,
    setShowPartialDialog,
    setShowTransferDialog,
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleMultiTransferChange,
  };
};
