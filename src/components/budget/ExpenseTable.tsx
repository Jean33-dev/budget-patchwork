
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface ExpenseTableProps {
  expenses: Envelope[];
  onEnvelopeClick: (envelope: Envelope) => void;
  onDeleteClick?: (envelope: Envelope) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
}

export const ExpenseTable = ({ 
  expenses,
  onEnvelopeClick,
  onDeleteClick,
  availableBudgets = []
}: ExpenseTableProps) => {
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

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden sm:table-cell">Budget associé</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((envelope) => (
              <TableRow 
                key={envelope.id}
                className="cursor-pointer hover:bg-muted"
              >
                <TableCell className="font-medium">
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
                <TableCell className="hidden sm:table-cell">
                  {formatDate(envelope.date)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {getBudgetTitle(envelope.linkedBudgetId)}
                </TableCell>
                <TableCell className="text-right">
                  {envelope.budget.toFixed(2)} €
                </TableCell>
                <TableCell className="p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onEnvelopeClick(envelope)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      {onDeleteClick && (
                        <DropdownMenuItem
                          onClick={() => onDeleteClick(envelope)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
