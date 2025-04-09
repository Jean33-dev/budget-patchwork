
import { useState } from "react";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { RecurringExpenseHeader } from "@/components/recurring/RecurringExpenseHeader";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";

const RecurringExpenses = () => {
  const {
    recurringExpenses,
    availableBudgets,
    isLoading,
    loadData,
    handleAddExpense,
    handleDeleteExpense,
    getBudgetName,
  } = useRecurringExpenses();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <RecurringExpenseHeader
        onRefresh={loadData}
        onAdd={() => setAddDialogOpen(true)}
      />

      {isLoading ? (
        <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
      ) : recurringExpenses.length === 0 ? (
        <RecurringExpenseEmptyState onAddClick={() => setAddDialogOpen(true)} />
      ) : (
        <RecurringExpenseGrid
          expenses={recurringExpenses}
          getBudgetName={getBudgetName}
          onDelete={handleDeleteExpense}
        />
      )}

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddExpense}
        availableBudgets={availableBudgets.map(budget => ({
          id: budget.id,
          title: budget.title,
        }))}
      />
    </div>
  );
};

export default RecurringExpenses;
