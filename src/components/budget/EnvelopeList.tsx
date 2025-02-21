
import { EnvelopeListHeader } from "./EnvelopeListHeader";
import { ExpenseTable } from "./ExpenseTable";
import { EnvelopeGrid } from "./EnvelopeGrid";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  linkedBudgetId?: string;
  date?: string;
}

interface EnvelopeListProps {
  envelopes: Envelope[];
  type: "income" | "expense" | "budget";
  onAddClick: () => void;
  onEnvelopeClick: (envelope: Envelope) => void;
  onDeleteClick?: (envelope: Envelope) => void;
  onViewExpenses?: (envelope: Envelope) => void;
  onDeleteEnvelope?: (id: string) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
}

export const EnvelopeList = ({ 
  envelopes, 
  type, 
  onAddClick, 
  onEnvelopeClick,
  onDeleteClick,
  onViewExpenses,
  onDeleteEnvelope,
  availableBudgets = []
}: EnvelopeListProps) => {
  const filteredEnvelopes = envelopes.filter((env) => env.type === type);

  return (
    <div className="space-y-4">
      <EnvelopeListHeader type={type} onAddClick={onAddClick} />
      
      {type === "expense" ? (
        <ExpenseTable 
          expenses={filteredEnvelopes}
          onEnvelopeClick={onEnvelopeClick}
          onDeleteClick={onDeleteClick}
          availableBudgets={availableBudgets}
        />
      ) : (
        <EnvelopeGrid 
          envelopes={filteredEnvelopes}
          onEnvelopeClick={onEnvelopeClick}
          onViewExpenses={onViewExpenses}
          onDeleteEnvelope={onDeleteEnvelope}
        />
      )}
    </div>
  );
};
