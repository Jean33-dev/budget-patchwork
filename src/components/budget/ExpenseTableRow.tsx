
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExpenseActionMenu } from "./ExpenseActionMenu";

interface ExpenseRowProps {
  envelope: {
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  };
  onEnvelopeClick: (envelope: ExpenseRowProps["envelope"]) => void;
  onEditClick: (envelope: ExpenseRowProps["envelope"]) => void;
  onDeleteClick: (envelope: ExpenseRowProps["envelope"]) => void;
  getBudgetTitle: (budgetId?: string) => string;
}

export const ExpenseTableRow = ({
  envelope,
  onEnvelopeClick,
  onEditClick,
  onDeleteClick,
  getBudgetTitle
}: ExpenseRowProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifiée";
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  return (
    <TableRow 
      key={envelope.id}
      className="cursor-pointer hover:bg-muted"
    >
      <TableCell 
        className="font-medium"
        onClick={() => onEnvelopeClick(envelope)}
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
        onClick={() => onEnvelopeClick(envelope)}
      >
        {formatDate(envelope.date)}
      </TableCell>
      <TableCell 
        className="hidden sm:table-cell"
        onClick={() => onEnvelopeClick(envelope)}
      >
        {getBudgetTitle(envelope.linkedBudgetId)}
      </TableCell>
      <TableCell 
        className="text-right"
        onClick={() => onEnvelopeClick(envelope)}
      >
        {envelope.budget.toFixed(2)} €
      </TableCell>
      <TableCell>
        <ExpenseActionMenu
          onEditClick={() => onEditClick(envelope)}
          onDeleteClick={() => onDeleteClick(envelope)}
        />
      </TableCell>
    </TableRow>
  );
};
