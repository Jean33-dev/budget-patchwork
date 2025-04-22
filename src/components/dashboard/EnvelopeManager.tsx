
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { useEffect } from "react";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  dashboardId?: string;
}

interface EnvelopeManagerProps {
  envelopes: Envelope[];
  onAddClick: (type: "income" | "expense" | "budget") => void;
  onEnvelopeClick: (envelope: Envelope) => void;
}

export const EnvelopeManager = ({ envelopes, onAddClick, onEnvelopeClick }: EnvelopeManagerProps) => {
  const { currentDashboardId } = useDashboardContext();
  
  useEffect(() => {
    console.log("EnvelopeManager - Current dashboard ID:", currentDashboardId);
    // Stocker l'ID du dashboard courant pour utilisation globale
    if (currentDashboardId) {
      localStorage.setItem('currentDashboardId', currentDashboardId);
    }
  }, [currentDashboardId]);
  
  // Filtrer les enveloppes par dashboardId quand nécessaire
  const filteredEnvelopes = currentDashboardId && currentDashboardId !== 'budget' 
    ? envelopes.filter(env => !env.dashboardId || env.dashboardId === currentDashboardId)
    : envelopes;

  return (
    <div className="space-y-8">
      <EnvelopeList
        envelopes={filteredEnvelopes}
        type="income"
        onAddClick={() => onAddClick("income")}
        onEnvelopeClick={onEnvelopeClick}
      />
      
      <EnvelopeList
        envelopes={filteredEnvelopes}
        type="budget"
        onAddClick={() => onAddClick("budget")}
        onEnvelopeClick={onEnvelopeClick}
      />
      
      <EnvelopeList
        envelopes={filteredEnvelopes}
        type="expense"
        onAddClick={() => onAddClick("expense")}
        onEnvelopeClick={onEnvelopeClick}
      />
    </div>
  );
};
