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
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Dépensé</TableHead>
                <TableHead className="text-right">Restant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnvelopes.map((envelope) => (
                <TableRow 
                  key={envelope.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => onEnvelopeClick(envelope)}
                >
                  <TableCell className="font-medium">{envelope.title}</TableCell>
                  <TableCell>{envelope.budget.toFixed(2)} €</TableCell>
                  <TableCell>{envelope.spent.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">
                    <span className={envelope.budget - envelope.spent < 0 ? "text-budget-expense" : "text-budget-income"}>
                      {Math.abs(envelope.budget - envelope.spent).toFixed(2)} €
                      {envelope.budget - envelope.spent < 0 ? " dépassé" : " restant"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          />
        ))}
      </div>
    </div>
  );
};