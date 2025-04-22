
import React from 'react';
import { EnvelopeListHeader } from "./EnvelopeListHeader";
import { EnvelopeGrid } from "./EnvelopeGrid";
import { Budget } from "@/hooks/useBudgets";

interface EnvelopeListProps {
  envelopes: Budget[];
  type: "income" | "expense" | "budget";
  onAddClick: () => void;
  onEnvelopeClick: (envelope: Budget) => void;
  onViewExpenses?: (envelope: Budget) => void;
  onDeleteClick?: (envelope: Budget) => void;
}

export const EnvelopeList: React.FC<EnvelopeListProps> = ({
  envelopes,
  type,
  onAddClick,
  onEnvelopeClick,
  onViewExpenses,
  onDeleteClick
}) => {
  return (
    <div className="space-y-4">
      <EnvelopeListHeader type={type} onAddClick={onAddClick} />
      <EnvelopeGrid
        envelopes={envelopes}
        type={type}
        onEnvelopeClick={onEnvelopeClick}
        onViewExpenses={onViewExpenses}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
};

