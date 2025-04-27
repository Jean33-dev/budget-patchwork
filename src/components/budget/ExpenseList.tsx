
import { useState, useEffect } from "react";
import { EnvelopeListHeader } from "./EnvelopeListHeader";
import { ExpenseTable } from "./ExpenseTable";
import { AddEnvelopeDialog } from "./AddEnvelopeDialog";
import { Expense, Budget } from "@/hooks/useExpenseManagement";

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
    date: string;
  }) => void;
  handleDeleteExpense?: (id: string) => void;
  handleUpdateExpense?: (expense: Expense) => void;
  defaultBudgetId?: string;
  showHeader?: boolean; // Ajout de cette propriété
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
  showHeader = true, // Par défaut, on affiche l'en-tête
}: ExpenseListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Log pour déboguer
  useEffect(() => {
    console.log("ExpenseList - received expenses:", expenses.length);
    if (expenses.length > 0) {
      console.log("ExpenseList - sample expense:", expenses[0]);
    } else {
      console.log("ExpenseList - No expenses provided to component");
    }
  }, [expenses]);

  const handleExpenseClick = (expense: Expense) => {
    console.log("Expense clicked:", expense);
    setSelectedExpense(expense);
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <EnvelopeListHeader
          type="expense"
          onAddClick={() => setAddDialogOpen(true)}
        />
      )}

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
