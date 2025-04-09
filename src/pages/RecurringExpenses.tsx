
import { useState } from "react";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { RecurringExpenseHeader } from "@/components/recurring/RecurringExpenseHeader";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { Expense } from "@/services/database/models/expense";

const RecurringExpenses = () => {
  const {
    recurringExpenses,
    availableBudgets,
    isLoading,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    handleAddToCurrentMonth,
    getBudgetName,
    currentDate,
  } = useRecurringExpenses();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditExpense(expense);
    setAddDialogOpen(true);
  };

  // Wrapper function to handle updating expenses with proper type
  const handleUpdateExpenseWrapper = (data: Expense) => {
    if (data.type === "expense") {
      handleUpdateExpense(data);
    }
  };

  // Wrapper function to handle adding expenses with proper type
  const handleAddExpenseWrapper = (data: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    if (data.type === "expense") {
      handleAddExpense(data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <RecurringExpenseHeader
        onAdd={() => {
          setEditExpense(null);
          setAddDialogOpen(true);
        }}
      />

      {isLoading ? (
        <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
      ) : recurringExpenses.length === 0 ? (
        <RecurringExpenseEmptyState onAddClick={() => {
          setEditExpense(null);
          setAddDialogOpen(true);
        }} />
      ) : (
        <RecurringExpenseGrid
          expenses={recurringExpenses}
          getBudgetName={getBudgetName}
          onDelete={handleDeleteExpense}
          onAddToCurrentMonth={handleAddToCurrentMonth}
          onEdit={handleEdit}
          currentDate={currentDate}
        />
      )}

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditExpense(null);
        }}
        onAdd={editExpense ? 
          (data) => handleUpdateExpenseWrapper({...editExpense, ...data} as Expense) : 
          handleAddExpenseWrapper}
        availableBudgets={availableBudgets.map(budget => ({
          id: budget.id,
          title: budget.title,
        }))}
        isRecurring={true}
        defaultValues={editExpense ? {
          title: editExpense.title,
          budget: editExpense.budget,
          linkedBudgetId: editExpense.linkedBudgetId,
          date: editExpense.date,
        } : undefined}
        dialogTitle={editExpense ? "Modifier la dépense récurrente" : "Ajouter une dépense récurrente"}
      />
    </div>
  );
};

export default RecurringExpenses;
