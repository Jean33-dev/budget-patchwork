import { EnvelopeCard } from "./EnvelopeCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  onViewExpenses?: (envelope: Envelope) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
}

export const EnvelopeList = ({ 
  envelopes, 
  type, 
  onAddClick, 
  onEnvelopeClick,
  onViewExpenses,
  availableBudgets = []
}: EnvelopeListProps) => {
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

  const getBudgetTitle = (budgetId?: string) => {
    if (!budgetId) return "Non assigné";
    const budget = availableBudgets.find(b => b.id === budgetId);
    return budget ? budget.title : "Budget inconnu";
  };

  if (type === "expense") {
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
        
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Budget associé</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnvelopes.map((envelope) => (
                  <TableRow 
                    key={envelope.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => onEnvelopeClick(envelope)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        {envelope.title}
                        <div className="sm:hidden text-sm text-muted-foreground">
                          {envelope.date || "Non spécifiée"}
                        </div>
                        <div className="sm:hidden text-sm text-muted-foreground">
                          {getBudgetTitle(envelope.linkedBudgetId)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {envelope.date || "Non spécifiée"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getBudgetTitle(envelope.linkedBudgetId)}
                    </TableCell>
                    <TableCell className="text-right">
                      {envelope.budget.toFixed(2)} €
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

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
            onViewExpenses={onViewExpenses ? () => onViewExpenses(envelope) : undefined}
          />
        ))}
      </div>
    </div>
  );
};