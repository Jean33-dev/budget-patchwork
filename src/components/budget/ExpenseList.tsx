
import { useState } from "react";
import { EnvelopeListHeader } from "./EnvelopeListHeader";
import { ExpenseTable } from "./ExpenseTable";
import { AddEnvelopeDialog } from "./AddEnvelopeDialog";
import { Budget, Expense } from "@/hooks/useExpenseManagement";

interface ExpenseListProps {
  expenses: Expense[];
  availableBudgets: Budget[];
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  handleAddEnvelope: (envelope: {
    title: string;
    budget: number;
    type: "expense";
    linkedBudgetId?: string;
    date?: string;
  }) => void;
  handleDeleteExpense?: (id: string) => void;
  handleUpdateExpense?: (expense: Expense) => void;
  defaultBudgetId?: string;
}

export const ExpenseList = ({
  expenses,
  availableBudgets,
  addDialogOpen,
  setAddDialogOpen,
  handleAddEnvelope,
  handleDeleteExpense,
  handleUpdateExpense,
  defaultBudgetId,
}: ExpenseListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
  };

  return (
    <div className="space-y-6">
      <EnvelopeListHeader
        type="expense"
        onAddClick={() => setAddDialogOpen(true)}
      />

      <ExpenseTable
        expenses={expenses}
        onEnvelopeClick={handleExpenseClick}
        availableBudgets={availableBudgets.map(budget => ({
          id: budget.id,
          title: budget.title,
        }))}
        onDeleteExpense={handleDeleteExpense}
        onUpdateExpense={handleUpdateExpense}
      />

      <AddEnvelopeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        type="expense"
        onAdd={handleAddEnvelope}
        availableBudgets={availableBudgets.map(budget => ({
          id: budget.id,
          title: budget.title,
        }))}
        defaultBudgetId={defaultBudgetId}
      />
    </div>
  );
};
