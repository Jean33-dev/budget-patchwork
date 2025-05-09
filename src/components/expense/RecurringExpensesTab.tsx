
import { useState } from "react";
import { RecurringExpenseHeader } from "@/components/recurring/RecurringExpenseHeader";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { EditBudgetDialog } from "@/components/budget/EditBudgetDialog";
import { DeleteBudgetDialog } from "@/components/budget/DeleteBudgetDialog";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";
import { ExpenseShareButton } from "./ExpenseShareButton";

interface RecurringExpensesTabProps {
  recurringExpenses: Expense[];
  availableBudgets: Budget[];
  isLoading: boolean;
  handleAddExpense: (data: any) => void;
  handleDeleteExpense: (id: string) => Promise<void>;
  handleAddToCurrentMonth: (expenseId: string) => Promise<void>;
  handleUpdateExpense: (expense: Expense) => Promise<void>;
  getBudgetName: (budgetId: string) => string;
  currentDate: string;
}

export function RecurringExpensesTab({
  recurringExpenses,
  availableBudgets,
  isLoading,
  handleAddExpense,
  handleDeleteExpense,
  handleAddToCurrentMonth,
  handleUpdateExpense,
  getBudgetName,
  currentDate
}: RecurringExpensesTabProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  return (
    <div className="space-y-4">
      <RecurringExpenseHeader onAdd={() => setAddDialogOpen(true)} />
      
      {/* Ajouter le bouton de partage en haut à droite */}
      <div className="flex justify-end mt-4 mb-2">
        <ExpenseShareButton expenses={recurringExpenses} budgets={availableBudgets} />
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
      ) : recurringExpenses.length === 0 ? (
        <RecurringExpenseEmptyState onAddClick={() => setAddDialogOpen(true)} />
      ) : (
        <RecurringExpenseGrid 
          expenses={recurringExpenses}
          budgets={availableBudgets}
          onDelete={(expense) => {
            setSelectedExpense(expense);
            setDeleteDialogOpen(true);
          }}
          onEdit={(expense) => {
            setSelectedExpense(expense);
            setEditDialogOpen(true);
          }}
          onAddToCurrentMonth={handleAddToCurrentMonth}
          getBudgetName={getBudgetName}
          currentDate={currentDate}
        />
      )}

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={(data) => handleAddExpense({...data, isRecurring: true})}
        availableBudgets={availableBudgets}
        isRecurring={true}
      />

      {selectedExpense && (
        <>
          <EditBudgetDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            budget={{
              ...selectedExpense,
              type: "expense" as const
            }}
            onSave={handleUpdateExpense}
            availableBudgets={availableBudgets}
            isExpense={true}
            isRecurring={true}
          />

          <DeleteBudgetDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onDelete={() => {
              if (selectedExpense) {
                handleDeleteExpense(selectedExpense.id);
              }
            }}
            type="expense"
            title={selectedExpense.title}
            isRecurring={true}
          />
        </>
      )}
    </div>
  );
}
