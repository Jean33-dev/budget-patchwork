
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
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date invalide";
    }
  };

  const handleRowClick = () => {
    console.log("Row clicked for expense:", envelope);
    // Now when a row is clicked, we directly open the edit dialog
    onEditClick(envelope);
  };

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit button clicked for expense:", envelope);
    onEditClick(envelope);
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete button clicked for expense:", envelope);
    onDeleteClick(envelope);
  };

  return (
    <TableRow 
      key={envelope.id}
      className="cursor-pointer hover:bg-muted"
    >
      <TableCell 
        className="font-medium"
        onClick={handleRowClick}
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
        onClick={handleRowClick}
      >
        {formatDate(envelope.date)}
      </TableCell>
      <TableCell 
        className="hidden sm:table-cell"
        onClick={handleRowClick}
      >
        {getBudgetTitle(envelope.linkedBudgetId)}
      </TableCell>
      <TableCell 
        className="text-right"
        onClick={handleRowClick}
      >
        {Number(envelope.budget).toFixed(2)} €
      </TableCell>
      <TableCell>
        <ExpenseActionMenu
          onEditClick={handleEditButtonClick}
          onDeleteClick={handleDeleteButtonClick}
        />
      </TableCell>
    </TableRow>
  );
};
