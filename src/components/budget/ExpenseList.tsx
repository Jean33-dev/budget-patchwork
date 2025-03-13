
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { EditExpenseDialog } from "@/components/budget/EditExpenseDialog";
import { DeleteExpenseDialog } from "@/components/budget/DeleteExpenseDialog";
import { type Budget, type Expense } from "@/hooks/useExpenseManagement";

interface ExpenseListProps {
  expenses: Expense[];
  availableBudgets: Budget[];
  selectedExpense: Expense | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editBudget: number;
  setEditBudget: (budget: number) => void;
  editDate: string;
  setEditDate: (date: string) => void;
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  handleEnvelopeClick: (expense: Expense) => void;
  handleDeleteClick: (expense: Expense) => void;
  handleEditSubmit: () => Promise<boolean>;
  handleDeleteConfirm: () => Promise<boolean>;
  handleAddEnvelope: (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }) => Promise<boolean>;
  defaultBudgetId?: string;
  isSubmitting?: boolean;
}

export const ExpenseList = ({
  expenses,
  availableBudgets,
  selectedExpense,
  editTitle,
  setEditTitle,
  editBudget,
  setEditBudget,
  editDate,
  setEditDate,
  addDialogOpen,
  setAddDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  handleEnvelopeClick,
  handleDeleteClick,
  handleEditSubmit,
  handleDeleteConfirm,
  handleAddEnvelope,
  defaultBudgetId,
  isSubmitting = false
}: ExpenseListProps) => {
  return (
    <div className="mt-6">
      <EnvelopeList
        envelopes={expenses}
        type="expense"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleEnvelopeClick}
        onDeleteClick={handleDeleteClick}
        availableBudgets={availableBudgets}
      />

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
        defaultBudgetId={defaultBudgetId}
        availableBudgets={availableBudgets}
      />

      <EditExpenseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={editTitle}
        onTitleChange={setEditTitle}
        budget={editBudget}
        onBudgetChange={setEditBudget}
        date={editDate}
        onDateChange={setEditDate}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteExpenseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
