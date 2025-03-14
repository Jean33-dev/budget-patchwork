
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteExpenseDialog } from "./DeleteExpenseDialog";
import { EditExpenseDialog } from "./EditExpenseDialog";

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
  availableBudgets?: Array<{ id: string; title: string }>;
  onDeleteExpense?: (id: string) => void;
  onUpdateExpense?: (expense: Envelope) => void;
}

export const ExpenseTable = ({ 
  expenses,
  onEnvelopeClick,
  availableBudgets = [],
  onDeleteExpense,
  onUpdateExpense
}: ExpenseTableProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Envelope | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableBudget, setEditableBudget] = useState(0);
  const [editableDate, setEditableDate] = useState("");
  
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

  const handleEditClick = (envelope: Envelope) => {
    setSelectedExpense(envelope);
    setEditableTitle(envelope.title);
    setEditableBudget(envelope.budget);
    setEditableDate(envelope.date || new Date().toISOString().split('T')[0]);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (envelope: Envelope) => {
    setSelectedExpense(envelope);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense && onDeleteExpense) {
      console.log("Suppression de la dépense confirmée:", selectedExpense.id);
      onDeleteExpense(selectedExpense.id);
      setSelectedExpense(null);
    }
  };

  const handleConfirmEdit = () => {
    if (selectedExpense && onUpdateExpense) {
      const updatedExpense = {
        ...selectedExpense,
        title: editableTitle,
        budget: editableBudget,
        spent: editableBudget, // Pour une dépense, spent == budget
        date: editableDate
      };
      console.log("Modification de la dépense confirmée:", updatedExpense);
      onUpdateExpense(updatedExpense);
      setIsEditDialogOpen(false);
      setSelectedExpense(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Budget associé</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((envelope) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(envelope);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(envelope);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteExpenseDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <EditExpenseDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={editableTitle}
        onTitleChange={setEditableTitle}
        budget={editableBudget}
        onBudgetChange={setEditableBudget}
        date={editableDate}
        onDateChange={setEditableDate}
        onSubmit={handleConfirmEdit}
      />
    </>
  );
};
