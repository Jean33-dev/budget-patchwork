
import { useState, useEffect } from "react";
import { EnvelopeListHeader } from "./EnvelopeListHeader";
import { ExpenseTable } from "./ExpenseTable";
import { AddEnvelopeDialog } from "./AddEnvelopeDialog";
import { Expense, Budget } from "@/hooks/useExpenseManagement";
import { ExpenseDialogs, useExpenseDialogState } from "./ExpenseDialogs";

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
  // Log pour déboguer
  useEffect(() => {
    console.log("ExpenseList - received expenses:", expenses.length);
    if (expenses.length > 0) {
      console.log("ExpenseList - sample expense:", expenses[0]);
    } else {
      console.log("ExpenseList - No expenses provided to component");
    }
  }, [expenses]);

  // Utilisation du hook pour gérer l'état des boîtes de dialogue
  const dialogState = useExpenseDialogState(handleUpdateExpense, handleDeleteExpense);

  // Créer un wrapper pour la fonction de suppression qui accepte un ID
  const handleDelete = handleDeleteExpense 
    ? (id: string) => dialogState.handleDeleteClick({ id } as Expense) 
    : undefined;

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
