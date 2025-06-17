
import { useState } from "react";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { RecurringExpenseHeader } from "@/components/recurring/RecurringExpenseHeader";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { Expense } from "@/services/database";
import { AddButton } from "@/components/budget/AddButton";
import { useTheme } from "@/context/ThemeContext";

const RecurringExpenses = () => {
  const {
    recurringExpenses,
    availableBudgets,
    isLoading,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    getBudgetName,
    currentDate,
  } = useRecurringExpenses();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const { currency: globalCurrency, t } = useTheme();

  const handleEdit = (expense: Expense) => {
    setEditExpense(expense);
    setAddDialogOpen(true);
  };

  const handleUpdateExpenseWrapper = (data: Expense) => {
    if (data.type === "expense") {
      handleUpdateExpense(data);
    }
  };

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

  const openAddDialog = () => {
    setEditExpense(null);
    setAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <RecurringExpenseHeader
        onAdd={openAddDialog}
      />

      {/* Garder uniquement ce bouton en haut */}
      <AddButton 
        onClick={openAddDialog} 
        label={t("expenses.addRecurringExpense")} 
      />

      {isLoading ? (
        <div className="text-center py-8">{t("expenses.loadingRecurring")}</div>
      ) : recurringExpenses.length === 0 ? (
        <RecurringExpenseEmptyState onAddClick={openAddDialog} />
      ) : (
        <RecurringExpenseGrid
          expenses={recurringExpenses}
          getBudgetName={getBudgetName}
          onDelete={handleDeleteExpense}
          onEdit={handleEdit}
          currentDate={currentDate}
          currency={globalCurrency}
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
        dialogTitle={editExpense ? t("expenses.editRecurring") : t("expenses.addRecurringExpense")}
        submitButtonText={editExpense ? t("editRecurringExpenseDialog.save") : undefined}
      />
    </div>
  );
};

export default RecurringExpenses;
