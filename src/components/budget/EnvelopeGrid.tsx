
import { EnvelopeCard } from "./EnvelopeCard";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  linkedBudgetId?: string;
  date?: string;
}

interface EnvelopeGridProps {
  envelopes: Envelope[];
  onEnvelopeClick: (envelope: Envelope) => void;
  onViewExpenses?: (envelope: Envelope) => void;
  onDeleteEnvelope?: (id: string) => void;
}

export const EnvelopeGrid = ({
  envelopes,
  onEnvelopeClick,
  onViewExpenses,
  onDeleteEnvelope,
}: EnvelopeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {envelopes.map((envelope, index) => (
        <div 
          key={envelope.id} 
          className="animate-fade-in" 
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <EnvelopeCard
            {...envelope}
            onEnvelopeClick={onEnvelopeClick}
            onViewExpenses={onViewExpenses}
            onDeleteEnvelope={onDeleteEnvelope}
          />
        </div>
      ))}
    </div>
  );
};
