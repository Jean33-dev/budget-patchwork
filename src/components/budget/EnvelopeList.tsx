
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
  envelopes = [], 
  type, 
  onAddClick, 
  onEnvelopeClick,
  onDeleteClick,
  onViewExpenses,
  onDeleteEnvelope,
  availableBudgets = []
}: EnvelopeListProps) => {
  // Validation des enveloppes pour éviter l'erreur de filtrage
  if (!Array.isArray(envelopes)) {
    console.error("EnvelopeList: envelopes is not an array", envelopes);
    return (
      <div className="space-y-4">
        <EnvelopeListHeader type={type} onAddClick={onAddClick} />
        <div className="p-4 border rounded-lg text-center text-muted-foreground">
          Données d'enveloppes invalides
        </div>
      </div>
    );
  }
  
  const filteredEnvelopes = envelopes.filter((env) => env && env.type === type);

  return (
    <div className="space-y-4">
      <EnvelopeListHeader type={type} onAddClick={onAddClick} />
      
      {type === "expense" ? (
        <ExpenseTable 
          expenses={filteredEnvelopes}
          onEnvelopeClick={onEnvelopeClick}
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
