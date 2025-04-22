
import { EnvelopeList } from "@/components/budget/EnvelopeList";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  date?: string;
}

interface EnvelopeManagerProps {
  envelopes: Envelope[];
  onAddClick: (type: "income" | "expense" | "budget") => void;
  onEnvelopeClick: (envelope: Envelope) => void;
}

export const EnvelopeManager = ({ envelopes, onAddClick, onEnvelopeClick }: EnvelopeManagerProps) => {
  const incomeEnvelopes = envelopes.filter(env => env.type === "income");
  const budgetEnvelopes = envelopes.filter(env => env.type === "budget");
  const expenseEnvelopes = envelopes.filter(env => env.type === "expense");

  return (
    <div className="space-y-8">
      <EnvelopeList
        envelopes={incomeEnvelopes}
        type="income"
        onAddClick={() => onAddClick("income")}
        onEnvelopeClick={onEnvelopeClick}
      />
      
      <EnvelopeList
        envelopes={budgetEnvelopes}
        type="budget"
        onAddClick={() => onAddClick("budget")}
        onEnvelopeClick={onEnvelopeClick}
      />
      
      <EnvelopeList
        envelopes={expenseEnvelopes}
        type="expense"
        onAddClick={() => onAddClick("expense")}
        onEnvelopeClick={onEnvelopeClick}
      />
    </div>
  );
};
