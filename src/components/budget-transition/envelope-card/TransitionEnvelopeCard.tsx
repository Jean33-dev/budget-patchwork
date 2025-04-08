
import React from "react";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { EnvelopeCardHeader } from "./EnvelopeCardHeader";
import { TransitionOptionSelector } from "./TransitionOptionSelector";
import { TransferOptions } from "./TransferOptions";
import { MultiTransferOptions } from "./MultiTransferOptions";
import { PartialAmountInput } from "./PartialAmountInput";

interface TransitionEnvelopeCardProps {
  envelope: BudgetEnvelope;
  otherEnvelopes: BudgetEnvelope[]; 
  onOptionChange: (envelopeId: string, option: TransitionOption) => void;
  onTransferTargetChange?: (envelopeId: string, targetId: string) => void;
  onPartialAmountChange?: (envelopeId: string, amount: number) => void;
  onMultiTransferChange?: (envelopeId: string, transfers: { targetId: string; targetTitle: string; amount: number }[]) => void;
}

export const TransitionEnvelopeCard = ({
  envelope,
  otherEnvelopes,
  onOptionChange,
  onTransferTargetChange,
  onPartialAmountChange,
  onMultiTransferChange
}: TransitionEnvelopeCardProps) => {
  // Determine which additional inputs to show based on selected option
  const showPartialInput = envelope.transitionOption === "partial";
  const showTransferOptions = envelope.transitionOption === "transfer";
  const showMultiTransferOptions = envelope.transitionOption === "multi-transfer";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
      <EnvelopeCardHeader 
        envelope={envelope}
      />
      
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <TransitionOptionSelector 
          selectedOption={envelope.transitionOption}
          onOptionChange={(option) => onOptionChange(envelope.id, option)}
        />

        {showTransferOptions && onTransferTargetChange && (
          <TransferOptions 
            envelope={envelope}
            otherEnvelopes={otherEnvelopes}
            onTransferTargetSelect={(targetId) => onTransferTargetChange(envelope.id, targetId)}
          />
        )}
        
        {showMultiTransferOptions && onMultiTransferChange && (
          <MultiTransferOptions 
            envelope={envelope}
            otherEnvelopes={otherEnvelopes}
            onMultiTransferChange={(transfers) => onMultiTransferChange(envelope.id, transfers)}
          />
        )}

        {showPartialInput && onPartialAmountChange && (
          <PartialAmountInput 
            envelope={envelope}
            onPartialAmountChange={(amount) => onPartialAmountChange(envelope.id, amount)}
          />
        )}
      </div>
    </div>
  );
};
