
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
  carriedOver: number; // Added this required property
  dashboardId: string; // Added this required property
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
  showHeader?: boolean; // Ajout d'une prop pour contrôler l'affichage de l'en-tête
}

export const EnvelopeList = ({ 
  envelopes, 
  type, 
  onAddClick, 
  onEnvelopeClick,
  onDeleteClick,
  onViewExpenses,
  onDeleteEnvelope,
  availableBudgets = [],
  showHeader = true // Par défaut, on affiche l'en-tête
}: EnvelopeListProps) => {
  const filteredEnvelopes = envelopes.filter((env) => env.type === type);

  return (
    <div className="space-y-4">
      {/* Afficher l'en-tête uniquement si showHeader est true */}
      {showHeader && (
        <EnvelopeListHeader type={type} onAddClick={onAddClick} />
      )}
      
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
