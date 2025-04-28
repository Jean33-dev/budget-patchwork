
import { EnvelopeCard } from "./EnvelopeCard";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {envelopes.map((envelope) => (
        <div key={envelope.id} className="relative">
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
