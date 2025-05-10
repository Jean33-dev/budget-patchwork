
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { RecurringExpenseHeader } from "@/components/recurring/RecurringExpenseHeader";
import { RecurringExpenseGrid } from "@/components/recurring/RecurringExpenseGrid";
import { RecurringExpenseEmptyState } from "@/components/recurring/RecurringExpenseEmptyState";
import { Expense } from "@/services/database/models/expense";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";

const RecurringExpenses = () => {
  const navigate = useNavigate();
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

  const handleDeleteWrapper = (expense: Expense) => {
    handleDeleteExpense(expense.id);
  };

  const openAddDialog = () => {
    setEditExpense(null);
    setAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      {/* Onglets de navigation */}
      <Tabs defaultValue="recurring" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger 
            value="monthly" 
            className="flex-1" 
            onClick={() => navigate("/dashboard/budget/expenses")}
          >
            Dépenses du mois
          </TabsTrigger>
          <TabsTrigger 
            value="recurring" 
            className="flex-1"
          >
            Dépenses récurrentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-6">
          <RecurringExpenseHeader
            onAdd={openAddDialog}
          />

          {isLoading ? (
            <div className="text-center py-8">Chargement des dépenses récurrentes...</div>
          ) : recurringExpenses.length === 0 ? (
            <RecurringExpenseEmptyState onAddClick={openAddDialog} />
          ) : (
            <RecurringExpenseGrid
              expenses={recurringExpenses}
              budgets={availableBudgets}
              getBudgetName={getBudgetName}
              onDelete={handleDeleteWrapper}
              onAddToCurrentMonth={handleAddToCurrentMonth}
              onEdit={handleEdit}
              currentDate={currentDate}
            />
          )}
        </TabsContent>
      </Tabs>

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
