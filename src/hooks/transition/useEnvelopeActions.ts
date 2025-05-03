
import { BudgetEnvelope, TransitionOption } from "@/types/transition";

export const useEnvelopeActions = (setEnvelopes: React.Dispatch<React.SetStateAction<BudgetEnvelope[]>>) => {
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

  const handleTransferTargetChange = (envelopeId: string, targetId: string) => {
    console.log(`Transfer target changed for ${envelopeId}:`, targetId);
    
    setEnvelopes(prev => {
      const targetEnvelope = prev.find(env => env.id === targetId);
      if (!targetEnvelope) {
        console.error('Target envelope not found:', targetId);
        return prev;
      }

      return prev.map(env =>
        env.id === envelopeId
          ? { 
              ...env, 
              transferTargetId: targetId,
              transferTargetTitle: targetEnvelope.title
            }
          : env
      );
    });
  };
  
  const handleMultiTransferChange = (
    envelopeId: string, 
    transfers: { targetId: string; targetTitle: string; amount: number }[]
  ) => {
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
    handleOptionChange,
    handleTransferTargetChange,
    handleMultiTransferChange
  };
};
