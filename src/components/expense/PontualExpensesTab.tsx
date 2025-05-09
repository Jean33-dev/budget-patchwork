
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
  
  // États pour ExpenseDialogs modifiés
  const [editableTitle, setEditableTitle] = useState("");
  const [editableBudget, setEditableBudget] = useState(0);
  const [editableDate, setEditableDate] = useState("");
  
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditableTitle(expense.title);
    setEditableBudget(expense.budget);
    setEditableDate(expense.date);
    setEditDialogOpen(true);
  };
  
  const handleDeleteExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmEdit = () => {
    if (selectedExpense) {
      handleUpdateExpense({
        ...selectedExpense,
        title: editableTitle,
        budget: editableBudget,
        date: editableDate
      });
    }
    setEditDialogOpen(false);
  };
  
  if (isLoading && !initAttempted) {
    return <BudgetLoadingState />;
  }

  if (error && !isLoading && initAttempted) {
    return <ExpenseErrorState handleRetry={handleRetry} />;
  }

  return (
    <div className="space-y-4">
      {/* Ajouter le bouton de partage en haut à droite */}
      <div className="flex justify-end mt-4 mb-2">
        <ExpenseShareButton expenses={expenses} budgets={availableBudgets} />
      </div>
      
      {/* Utiliser correctement ExpenseList avec les props qu'elle attend */}
      <ExpenseList
        expenses={expenses}
        availableBudgets={availableBudgets} 
        showHeader={false}
        addDialogOpen={false}
        setAddDialogOpen={() => {}}
        handleAddEnvelope={() => {}}
      />

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
        availableBudgets={availableBudgets}
        defaultBudgetId={budgetId}
      />

      {/* Adapter les propriétés pour ExpenseDialogs */}
      <ExpenseDialogs
        selectedExpense={selectedExpense}
        isEditDialogOpen={editDialogOpen}
        setIsEditDialogOpen={setEditDialogOpen}
        editableTitle={editableTitle}
        setEditableTitle={setEditableTitle}
        editableBudget={editableBudget}
        setEditableBudget={setEditableBudget}
        editableDate={editableDate}
        setEditableDate={setEditableDate}
        onConfirmEdit={handleConfirmEdit}
      />
    </div>
  );
}
