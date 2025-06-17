
import { AddButton } from "@/components/budget/AddButton";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/hooks/useBudgets";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface RecurringExpensesTabProps {
  recurringExpenses: Expense[];
  availableBudgets: Budget[];
  isLoading: boolean;
  handleAddExpense: (expense: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => void;
  handleDeleteExpense: (id: string) => void;
  handleUpdateExpense: (expense: Expense) => void;
  getBudgetName: (id: string) => string;
  currentDate: string;
  currency?: "EUR" | "USD" | "GBP";
}

export const RecurringExpensesTab = ({
  recurringExpenses,
  availableBudgets,
  isLoading,
  handleAddExpense,
  handleDeleteExpense,
  handleUpdateExpense,
  getBudgetName,
  currentDate,
  currency
}: RecurringExpensesTabProps) => {
  const { toast } = useToast();
  const [addRecurringDialogOpen, setAddRecurringDialogOpen] = useState(false);
  const [editRecurringExpense, setEditRecurringExpense] = useState<Expense | null>(null);
  const { currency: globalCurrency, t } = useTheme();
  const usedCurrency = currency || globalCurrency;

  useEffect(() => {
    if (!addRecurringDialogOpen) {
      setEditRecurringExpense(null);
    }
  }, [addRecurringDialogOpen]);

  const handleAddRecurringExpenseWrapper = (expense: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    if (expense.type === "expense") {
      handleAddExpense(expense);
    } else {
      toast({
        variant: "destructive",
        title: t("expenses.errorTitle"),
        description: t("expenses.typeMustBeExpense")
      });
    }
  };

  const handleEditRecurringExpense = (expense: Expense) => {
    setEditRecurringExpense(expense);
    setAddRecurringDialogOpen(true);
  };

  const handleUpdateRecurringExpenseWrapper = (data: Expense) => {
    if (data.type === "expense") {
      handleUpdateExpense(data);
    }
  };

  const openAddRecurringDialog = () => {
    setEditRecurringExpense(null);
    setAddRecurringDialogOpen(true);
  };

  return (
    <>
      <AddButton
        onClick={openAddRecurringDialog}
        label={t("expenses.addRecurringExpense")}
      />

      {isLoading ? (
        <div className="text-center py-8">{t("expenses.loadingRecurring")}</div>
      ) : recurringExpenses.length === 0 ? (
        <RecurringExpenseEmptyState onAddClick={openAddRecurringDialog} />
      ) : (
        <RecurringExpenseGrid
          expenses={recurringExpenses}
          getBudgetName={getBudgetName}
          onDelete={handleDeleteExpense}
          onEdit={handleEditRecurringExpense}
          currentDate={currentDate}
          currency={usedCurrency}
        />
      )}

      <AddEnvelopeDialog
        type="expense"
        open={addRecurringDialogOpen}
        onOpenChange={setAddRecurringDialogOpen}
        onAdd={editRecurringExpense ? 
          (data) => handleUpdateRecurringExpenseWrapper({...editRecurringExpense, ...data} as Expense) : 
          handleAddRecurringExpenseWrapper}
        availableBudgets={availableBudgets.map(budget => ({
          id: budget.id,
          title: budget.title,
        }))}
        isRecurring={true}
        defaultValues={editRecurringExpense ? {
          title: editRecurringExpense.title,
          budget: editRecurringExpense.budget,
          linkedBudgetId: editRecurringExpense.linkedBudgetId,
          date: editRecurringExpense.date,
        } : undefined}
        dialogTitle={
          editRecurringExpense ? t("expenses.editRecurring") : t("expenses.addRecurringExpense")
        }
        submitButtonText={editRecurringExpense ? t("editRecurringExpenseDialog.save") : undefined}
      />
    </>
  );
};
