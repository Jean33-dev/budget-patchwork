
import React, { useState, useEffect } from 'react';
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { EnvelopeCardHeader } from './card/EnvelopeCardHeader';
import { OptionSelector } from './card/OptionSelector';
import { MultiTransferControl } from './card/MultiTransferControl';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransitionEnvelopeCardProps {
  envelope: BudgetEnvelope;
  otherEnvelopes: BudgetEnvelope[]; 
  onOptionChange: (envelopeId: string, option: TransitionOption) => void;
  onTransferTargetChange?: (envelopeId: string, targetId: string) => void;
  onMultiTransferChange?: (envelopeId: string, transfers: { targetId: string; targetTitle: string; amount: number }[]) => void;
  currency?: "EUR" | "USD" | "GBP";
}

export const TransitionEnvelopeCard = ({
  envelope,
  otherEnvelopes,
  onOptionChange,
  onTransferTargetChange,
  onMultiTransferChange,
  currency = "EUR"
}: TransitionEnvelopeCardProps) => {
  const isMobile = useIsMobile();
  
  // Local state to display selected option
  const [selectedOption, setSelectedOption] = useState<TransitionOption>(envelope.transitionOption);
  const [multiTransfers, setMultiTransfers] = useState<{ targetId: string; targetTitle: string; amount: number }[]>(
    envelope.multiTransfers || []
  );
  
  // Update the local state when the envelope changes
  useEffect(() => {
    setSelectedOption(envelope.transitionOption);
    setMultiTransfers(envelope.multiTransfers || []);
  }, [envelope.transitionOption, envelope.multiTransfers]);
  
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

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-start sm:items-center justify-between gap-4 p-4 border rounded-lg`}>
      <EnvelopeCardHeader envelope={envelope} currency={currency} />
      
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <OptionSelector
          envelope={envelope}
          otherEnvelopes={otherEnvelopes}
          selectedOption={selectedOption}
          onOptionChange={handleOptionChange}
          onTransferTargetSelect={handleTransferTargetSelect}
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
