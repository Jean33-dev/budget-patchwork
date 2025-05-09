
import { useState } from "react";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { ExpenseErrorState } from "@/components/budget/ExpenseErrorState";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { ExpenseDialogs } from "@/components/budget/ExpenseDialogs";
import { ExpenseShareButton } from "./ExpenseShareButton";

interface PontualExpensesTabProps {
  isLoading: boolean;
  error: Error | null;
  initAttempted: boolean;
  isProcessing: boolean;
  expenses: Expense[];
  availableBudgets: Budget[];
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  handleAddEnvelope: (data: any) => void;
  handleDeleteExpense: (id: string) => Promise<void>;
  handleUpdateExpense: (expense: Expense) => Promise<void>;
  forceReload: () => void;
  handleRetry: () => void;
  budgetId?: string;
}

export function PontualExpensesTab({
  isLoading,
  error,
  initAttempted,
  expenses,
  availableBudgets,
  addDialogOpen,
  setAddDialogOpen,
  handleAddEnvelope,
  handleDeleteExpense,
  handleUpdateExpense,
  forceReload,
  handleRetry,
  budgetId
}: PontualExpensesTabProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  if (isLoading && !initAttempted) {
    return <BudgetLoadingState />;
  }

  if (error && !isLoading && initAttempted) {
    return <ExpenseErrorState onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-4">
      {/* Ajouter le bouton de partage en haut à droite */}
      <div className="flex justify-end mt-4 mb-2">
        <ExpenseShareButton expenses={expenses} budgets={availableBudgets} />
      </div>
      
      <ExpenseList
        expenses={expenses}
        availableBudgets={availableBudgets}
        onEdit={(expense) => {
          setSelectedExpense(expense);
          setEditDialogOpen(true);
        }}
        onDelete={(expense) => {
          setSelectedExpense(expense);
          setDeleteDialogOpen(true);
        }}
      />

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
        availableBudgets={availableBudgets}
        budgetId={budgetId}
      />

      <ExpenseDialogs
        selectedExpense={selectedExpense}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        handleDeleteExpense={handleDeleteExpense}
        handleUpdateExpense={handleUpdateExpense}
        availableBudgets={availableBudgets}
      />
    </div>
  );
}
