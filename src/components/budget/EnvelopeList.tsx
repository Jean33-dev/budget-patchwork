import { EnvelopeCard } from "./EnvelopeCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense";
}

interface EnvelopeListProps {
  envelopes: Envelope[];
  type: "income" | "expense";
  onAddClick: () => void;
  onEnvelopeClick: (envelope: Envelope) => void;
}

export const EnvelopeList = ({ envelopes, type, onAddClick, onEnvelopeClick }: EnvelopeListProps) => {
  const filteredEnvelopes = envelopes.filter((env) => env.type === type);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {type === "income" ? "Income" : "Expenses"}
        </h2>
        <Button onClick={onAddClick} variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type === "income" ? "Income" : "Expense"}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEnvelopes.map((envelope) => (
          <EnvelopeCard
            key={envelope.id}
            {...envelope}
            onClick={() => onEnvelopeClick(envelope)}
          />
        ))}
      </div>
    </div>
  );
};