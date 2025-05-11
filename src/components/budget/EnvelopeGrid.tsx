
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
}

export const EnvelopeGrid = ({
  envelopes,
  onEnvelopeClick,
}: EnvelopeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {envelopes.map((envelope, index) => (
        <div 
          key={envelope.id} 
          className="animate-fade-in transition-all hover:translate-y-[-4px] hover:shadow-lg"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both'
          }}
        >
          <EnvelopeCard
            budget={envelope}
            onClick={onEnvelopeClick}
          />
        </div>
      ))}
    </div>
  );
};
