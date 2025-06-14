
import React from "react";
import { BudgetEnvelope, TransitionOption } from "@/types/transition";
import { TransitionEnvelopeCard } from "./TransitionEnvelopeCard";

interface TransitionEnvelopeGridProps {
  envelopes: BudgetEnvelope[];
  onOptionChange: (envelopeId: string, option: TransitionOption) => void;
  onTransferTargetChange?: (envelopeId: string, targetId: string) => void;
  onMultiTransferChange?: (envelopeId: string, transfers: { targetId: string; targetTitle: string; amount: number }[]) => void;
  currency?: "EUR" | "USD" | "GBP";
}

export const TransitionEnvelopeGrid = ({ 
  envelopes, 
  onOptionChange,
  onTransferTargetChange,
  onMultiTransferChange,
  currency = "EUR"
}: TransitionEnvelopeGridProps) => {
  return (
    <div className="grid gap-4">
      {envelopes.map(envelope => (
        <TransitionEnvelopeCard
          key={envelope.id}
          envelope={envelope}
          otherEnvelopes={envelopes.filter(e => e.id !== envelope.id)}
          onOptionChange={onOptionChange}
          onTransferTargetChange={onTransferTargetChange}
          onMultiTransferChange={onMultiTransferChange}
          currency={currency}
        />
      ))}
    </div>
  );
};
