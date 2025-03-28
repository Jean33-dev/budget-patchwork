
import { useState } from "react";
import { useExpenseData } from "./useExpenseData";
import { expenseOperations, ExpenseFormData } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

export type { Expense, Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { expenses, availableBudgets, isLoading, error, initAttempted, loadData } = useExpenseData(budgetId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddEnvelope = async (envelopeData: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }) => {
    if (envelopeData.type !== "expense") {
      return;
    }

    const expenseData: ExpenseFormData = {
      title: envelopeData.title,
      budget: envelopeData.budget,
      type: "expense",
      linkedBudgetId: budgetId || envelopeData.linkedBudgetId,
      date: envelopeData.date || new Date().toISOString().split('T')[0]
    };

    const success = await expenseOperations.addExpense(expenseData);
    
    if (success) {
      setAddDialogOpen(false);
      await loadData();
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const success = await expenseOperations.deleteExpense(id);
    if (success) {
      await loadData();
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    const success = await expenseOperations.updateExpense(updatedExpense);
    if (success) {
      await loadData();
    }
  };

  return {
    expenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    loadData,
    isLoading,
    error,
    initAttempted
  };
};
