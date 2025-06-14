
import { EnvelopeCard } from "./EnvelopeCard";
import { Button } from "@/components/ui/button";

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
  currency?: "EUR" | "USD" | "GBP";
}

export const EnvelopeGrid = ({
  envelopes,
  onEnvelopeClick,
  onViewExpenses,
  onDeleteEnvelope,
  currency,
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
            {...envelope}
            onEnvelopeClick={onEnvelopeClick}
            onViewExpenses={onViewExpenses}
            onDeleteEnvelope={onDeleteEnvelope}
            currency={currency}
          />
        </div>
      ))}
    </div>
  );
};
