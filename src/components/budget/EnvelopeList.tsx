
import { EnvelopeCard } from "./EnvelopeCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  envelopes, 
  type, 
  onAddClick, 
  onEnvelopeClick,
  onDeleteClick,
  onViewExpenses,
  onDeleteEnvelope,
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifiée";
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return "Date invalide";
    }
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
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnvelopes.map((envelope) => (
                  <TableRow 
                    key={envelope.id}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <TableCell 
                      className="font-medium"
                    >
                      <div>
                        {envelope.title}
                        <div className="sm:hidden text-sm text-muted-foreground">
                          {formatDate(envelope.date)}
                        </div>
                        <div className="sm:hidden text-sm text-muted-foreground">
                          {getBudgetTitle(envelope.linkedBudgetId)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell 
                      className="hidden sm:table-cell"
                    >
                      {formatDate(envelope.date)}
                    </TableCell>
                    <TableCell 
                      className="hidden sm:table-cell"
                    >
                      {getBudgetTitle(envelope.linkedBudgetId)}
                    </TableCell>
                    <TableCell 
                      className="text-right"
                    >
                      {envelope.budget.toFixed(2)} €
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEnvelopeClick(envelope);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {onDeleteClick && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteClick(envelope);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
          <div key={envelope.id} className="relative">
            <EnvelopeCard
              {...envelope}
              onClick={() => onEnvelopeClick(envelope)}
              onViewExpenses={onViewExpenses ? () => onViewExpenses(envelope) : undefined}
            />
            {onDeleteEnvelope && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEnvelope(envelope.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
