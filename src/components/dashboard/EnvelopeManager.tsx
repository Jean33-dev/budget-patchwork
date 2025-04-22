import { EnvelopeList } from "@/components/budget/EnvelopeList";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
}

interface EnvelopeManagerProps {
  envelopes: Envelope[];
  onAddClick: (type: "income" | "expense" | "budget") => void;
  onEnvelopeClick: (envelope: Envelope) => void;
}

export const EnvelopeManager = ({ envelopes, onAddClick, onEnvelopeClick }: EnvelopeManagerProps) => {
  return (
    <div className="space-y-8">
      <EnvelopeList
        envelopes={envelopes}
        type="income"
        onAddClick={() => onAddClick("income")}
        onEnvelopeClick={onEnvelopeClick}
      />
      
      <EnvelopeList
        envelopes={envelopes}
        type="budget"
        onAddClick={() => onAddClick("budget")}
        onEnvelopeClick={onEnvelopeClick}
      />
      
      <EnvelopeList
        envelopes={envelopes}
        type="expense"
        onAddClick={() => onAddClick("expense")}
        onEnvelopeClick={onEnvelopeClick}
      />
    </div>
  );
};