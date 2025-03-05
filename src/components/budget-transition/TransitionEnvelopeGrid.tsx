
import React from "react";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { TransitionEnvelopeCard } from "./TransitionEnvelopeCard";

interface TransitionEnvelopeGridProps {
  envelopes: BudgetEnvelope[];
  onOptionChange: (envelopeId: string, option: TransitionOption) => void;
}

export const TransitionEnvelopeGrid = ({ 
  envelopes, 
  onOptionChange 
}: TransitionEnvelopeGridProps) => {
  return (
    <div className="grid gap-4">
      {envelopes.map(envelope => (
        <TransitionEnvelopeCard
          key={envelope.id}
          envelope={envelope}
          otherEnvelopes={envelopes.filter(e => e.id !== envelope.id)}
          onOptionChange={onOptionChange}
        />
      ))}
    </div>
  );
};
