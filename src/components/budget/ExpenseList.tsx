
import { useState, useEffect } from "react";
import { EnvelopeListHeader } from "./EnvelopeListHeader";
import { ExpenseTable } from "./ExpenseTable";
import { AddEnvelopeDialog } from "./AddEnvelopeDialog";
import { Expense, Budget } from "@/hooks/useExpenseManagement";
import { ExpenseDialogs, useExpenseDialogState } from "./ExpenseDialogs";
import { useTheme } from "@/context/ThemeContext";

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
  showHeader?: boolean;
  currency?: "EUR" | "USD" | "GBP";
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
  showHeader = true,
  currency,
}: ExpenseListProps) => {
  useEffect(() => {
    console.log("ExpenseList - received expenses:", expenses.length);
    if (expenses.length > 0) {
      console.log("ExpenseList - sample expense:", expenses[0]);
    } else {
      console.log("ExpenseList - No expenses provided to component");
    }
  }, [expenses]);

  const dialogState = useExpenseDialogState(handleUpdateExpense, handleDeleteExpense);

  const handleDelete = handleDeleteExpense 
    ? (id: string) => dialogState.handleDeleteClick({ id } as Expense) 
    : undefined;

  const { currency: globalCurrency } = useTheme();
  const usedCurrency = currency || globalCurrency;

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
        onEnvelopeClick={dialogState.handleEditClick}
        availableBudgets={availableBudgets.map(budget => ({
          id: budget.id,
          title: budget.title,
        }))}
        onDeleteExpense={handleDelete}
        onUpdateExpense={handleUpdateExpense}
        currency={usedCurrency}
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

      <ExpenseDialogs
        selectedExpense={dialogState.selectedExpense}
        isEditDialogOpen={dialogState.isEditDialogOpen}
        setIsEditDialogOpen={dialogState.setIsEditDialogOpen}
        editableTitle={dialogState.editableTitle}
        setEditableTitle={dialogState.setEditableTitle}
        editableBudget={dialogState.editableBudget}
        setEditableBudget={dialogState.setEditableBudget}
        editableDate={dialogState.editableDate}
        setEditableDate={dialogState.setEditableDate}
        onConfirmEdit={dialogState.handleConfirmEdit}
      />
    </div>
  );
};
