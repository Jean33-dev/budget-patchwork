
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseTableRow } from "./ExpenseTableRow";
import { ExpenseDialogs, useExpenseDialogState } from "./ExpenseDialogs";

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
  const {
    selectedExpense,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editableTitle,
    setEditableTitle,
    editableBudget,
    setEditableBudget,
    editableDate,
    setEditableDate,
    handleEditClick,
    handleDeleteClick,
    handleConfirmEdit
  } = useExpenseDialogState(onUpdateExpense);
  
  const getBudgetTitle = (budgetId?: string) => {
    if (!budgetId) return "Non assigné";
    const budget = availableBudgets.find(b => b.id === budgetId);
    return budget ? budget.title : "Budget inconnu";
  };

  const handleConfirmDelete = () => {
    if (selectedExpense && onDeleteExpense) {
      console.log("Suppression de la dépense confirmée:", selectedExpense.id);
      onDeleteExpense(selectedExpense.id);
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
                <ExpenseTableRow
                  key={envelope.id}
                  envelope={envelope}
                  onEnvelopeClick={onEnvelopeClick}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  getBudgetTitle={getBudgetTitle}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ExpenseDialogs 
        selectedExpense={selectedExpense}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        editableTitle={editableTitle}
        setEditableTitle={setEditableTitle}
        editableBudget={editableBudget}
        setEditableBudget={setEditableBudget}
        editableDate={editableDate}
        setEditableDate={setEditableDate}
        onConfirmEdit={handleConfirmEdit}
      />
    </>
  );
};
