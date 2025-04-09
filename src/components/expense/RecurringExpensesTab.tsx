
import { AddButton } from "@/components/budget/AddButton";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/hooks/useBudgets";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  handleAddToCurrentMonth: (id: string) => Promise<void>;
  handleUpdateExpense: (expense: Expense) => void;
  getBudgetName: (id: string) => string;
  currentDate: string;
}

export const RecurringExpensesTab = ({
  recurringExpenses,
  availableBudgets,
  isLoading,
  handleAddExpense,
  handleDeleteExpense,
  handleAddToCurrentMonth,
  handleUpdateExpense,
  getBudgetName,
  currentDate
}: RecurringExpensesTabProps) => {
  const { toast } = useToast();
  const [addRecurringDialogOpen, setAddRecurringDialogOpen] = useState(false);
  const [editRecurringExpense, setEditRecurringExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (!addRecurringDialogOpen) {
      setEditRecurringExpense(null);
    }
  }, [addRecurringDialogOpen]);

  // Wrapper function for type safety
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
        title: "Erreur",
        description: "Le type doit être 'expense'"
      });
    }
  };

  // Wrapper function for type safety
  const handleEditRecurringExpense = (expense: Expense) => {
    setEditRecurringExpense(expense);
    setAddRecurringDialogOpen(true);
  };

  // Wrapper function for type safety
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
        label="Ajouter une dépense récurrente"
      />

      {isLoading ? (
        <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
      ) : recurringExpenses.length === 0 ? (
        <RecurringExpenseEmptyState onAddClick={openAddRecurringDialog} />
      ) : (
        <RecurringExpenseGrid
          expenses={recurringExpenses}
          getBudgetName={getBudgetName}
          onDelete={handleDeleteExpense}
          onAddToCurrentMonth={handleAddToCurrentMonth}
          onEdit={handleEditRecurringExpense}
          currentDate={currentDate}
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
        dialogTitle={editRecurringExpense ? "Modifier la dépense récurrente" : "Ajouter une dépense récurrente"}
      />
    </>
  );
};
