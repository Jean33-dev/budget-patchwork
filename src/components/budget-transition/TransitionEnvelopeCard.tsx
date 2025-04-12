
import React, { useState, useEffect } from 'react';
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { EnvelopeCardHeader } from './card/EnvelopeCardHeader';
import { OptionSelector } from './card/OptionSelector';
import { MultiTransferControl } from './card/MultiTransferControl';

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
  // Local state to display selected option
  const [partialAmount, setPartialAmount] = useState(envelope.partialAmount || 0);
  const [selectedOption, setSelectedOption] = useState<TransitionOption>(envelope.transitionOption);
  const [multiTransfers, setMultiTransfers] = useState<{ targetId: string; targetTitle: string; amount: number }[]>(
    envelope.multiTransfers || []
  );
  
  // Update the local state when the envelope changes
  useEffect(() => {
    setSelectedOption(envelope.transitionOption);
    setPartialAmount(envelope.partialAmount || 0);
    setMultiTransfers(envelope.multiTransfers || []);
  }, [envelope.transitionOption, envelope.partialAmount, envelope.multiTransfers]);
  
  // Debug logs
  console.log('Rendering envelope card:', {
    id: envelope.id,
    title: envelope.title,
    option: envelope.transitionOption,
    selectedOption: selectedOption
  });

  const showMultiTransferOptions = selectedOption === "multi-transfer";

  const handleOptionChange = (option: TransitionOption) => {
    console.log(`Option changed for ${envelope.id} from ${selectedOption} to:`, option);
    setSelectedOption(option);
    onOptionChange(envelope.id, option);
  };

  const handleTransferTargetSelect = (targetId: string) => {
    if (onTransferTargetChange) {
      console.log(`Transfer target selected for ${envelope.id}:`, targetId);
      onTransferTargetChange(envelope.id, targetId);
    }
  };

  const handlePartialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount) && amount >= 0 && amount <= envelope.remaining) {
      setPartialAmount(amount);
    }
  };

  const confirmPartialAmount = () => {
    if (onPartialAmountChange) {
      onPartialAmountChange(envelope.id, partialAmount);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
      <EnvelopeCardHeader envelope={envelope} />
      
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <OptionSelector
          envelope={envelope}
          otherEnvelopes={otherEnvelopes}
          selectedOption={selectedOption}
          onOptionChange={handleOptionChange}
          onTransferTargetSelect={handleTransferTargetSelect}
          partialAmount={partialAmount}
          handlePartialAmountChange={handlePartialAmountChange}
          confirmPartialAmount={confirmPartialAmount}
        />
        
        {showMultiTransferOptions && onMultiTransferChange && (
          <MultiTransferControl
            envelope={envelope}
            otherEnvelopes={otherEnvelopes}
            multiTransfers={multiTransfers}
            setMultiTransfers={setMultiTransfers}
            onMultiTransferChange={onMultiTransferChange}
          />
        )}
      </div>
    </div>
  );
};
