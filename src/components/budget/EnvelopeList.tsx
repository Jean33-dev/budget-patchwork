import { EnvelopeCard } from "./EnvelopeCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
}

interface EnvelopeListProps {
  envelopes: Envelope[];
  type: "income" | "expense" | "budget";
  onAddClick: () => void;
  onEnvelopeClick: (envelope: Envelope) => void;
}

export const EnvelopeList = ({ envelopes, type, onAddClick, onEnvelopeClick }: EnvelopeListProps) => {
  const filteredEnvelopes = envelopes.filter((env) => env.type === type);

  const getTypeLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income":
        return "Revenus";
      case "expense":
        return "Dépenses";
      case "budget":
        return "Budgets";
      default:
        return "";
    }
  };

  const getAddButtonLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income":
        return "un revenu";
      case "expense":
        return "une dépense";
      case "budget":
        return "un budget";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          {getTypeLabel(type)}
        </h2>
        <Button onClick={onAddClick} variant="outline" size="sm" className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter {getAddButtonLabel(type)}
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