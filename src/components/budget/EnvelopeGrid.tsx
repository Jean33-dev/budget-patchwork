
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
  type: "income" | "expense" | "budget";
  onEnvelopeClick: (envelope: Envelope) => void;
  onViewExpenses?: (envelope: Envelope) => void;
  onDeleteClick?: (envelope: Envelope) => void;
}

export const EnvelopeGrid = ({
  envelopes,
  type,
  onEnvelopeClick,
  onViewExpenses,
  onDeleteClick,
}: EnvelopeGridProps) => {
  // Filter envelopes by type
  const filteredEnvelopes = envelopes.filter(env => env.type === type);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredEnvelopes.map((envelope) => (
        <div key={envelope.id} className="relative">
          <EnvelopeCard
            {...envelope}
            onClick={() => onEnvelopeClick(envelope)}
            onViewExpenses={onViewExpenses ? () => onViewExpenses(envelope) : undefined}
          />
          {onDeleteClick && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(envelope);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
