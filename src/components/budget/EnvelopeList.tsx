
import React from 'react';
import { EnvelopeListHeader } from "./EnvelopeListHeader";
import { EnvelopeGrid } from "./EnvelopeGrid";

// Creating a more generic type that works for both Envelope and Budget
interface EnvelopeItem {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  category?: string;
  date?: string;
  carriedOver?: number;
  dashboardId?: string;
}

interface EnvelopeListProps {
  envelopes: EnvelopeItem[];
  type: "income" | "expense" | "budget";
  onAddClick: () => void;
  onEnvelopeClick: (envelope: EnvelopeItem) => void;
  onViewExpenses?: (envelope: EnvelopeItem) => void;
  onDeleteClick?: (envelope: EnvelopeItem) => void;
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
