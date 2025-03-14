
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { type Budget, type Expense } from "@/hooks/useExpenseManagement";

interface ExpenseListProps {
  expenses: Expense[];
  availableBudgets: Budget[];
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  handleAddEnvelope: (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }) => void;
  defaultBudgetId?: string;
}

export const ExpenseList = ({
  expenses,
  availableBudgets,
  addDialogOpen,
  setAddDialogOpen,
  handleAddEnvelope,
  defaultBudgetId
}: ExpenseListProps) => {
  return (
    <div className="mt-6">
      <EnvelopeList
        envelopes={expenses}
        type="expense"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={() => {}} // Fonction vide pour l'affichage uniquement
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
    </div>
  );
};
