
import { useExpenseData } from "./useExpenseData";
import { useExpenseEditing } from "./useExpenseEditing";
import { useExpenseDeletion } from "./useExpenseDeletion";
import { useExpenseAddition } from "./useExpenseAddition";
import { useExpenseDialogs } from "./useExpenseDialogs";
import { Expense, Budget } from "@/types/expense";

// Re-export the types for backward compatibility
export type { Expense, Budget };

export const useExpenseManagement = (
  budgetId: string | null,
  navigateCallback?: () => void // Nouveau paramètre pour la navigation
) => {
  // Get expense data
  const { expenses, availableBudgets, setExpenses, loadData } = useExpenseData(budgetId);
  
  // Dialog state management
  const { 
    addDialogOpen, editDialogOpen, deleteDialogOpen, 
    setAddDialogOpen, setEditDialogOpen, setDeleteDialogOpen 
  } = useExpenseDialogs();
  
  // Expense editing functionality
  const { 
    selectedExpense: editingExpense,
    editTitle, 
    editBudget, 
    editDate,
    setEditTitle,
    setEditBudget,
    setEditDate,
    handleEnvelopeClick,
    handleEditSubmit,
    resetEditState
  } = useExpenseEditing(setExpenses, loadData);
  
  // Expense deletion functionality avec callback de navigation
  const { 
    selectedExpense: deletingExpense,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteState,
    onDeleteSuccess: navigationCallback
  } = useExpenseDeletion(setExpenses, loadData, navigateCallback);
  
  // Expense addition functionality
  const { handleAddEnvelope } = useExpenseAddition(setExpenses, loadData, budgetId);

  // Handle envelope click with dialog opening
  const handleEnvelopeClickWithDialog = (expense: Expense) => {
    if (handleEnvelopeClick(expense)) {
      setEditDialogOpen(true);
    }
  };

  // Handle delete click with dialog opening
  const handleDeleteClickWithDialog = (expense: Expense) => {
    if (handleDeleteClick(expense)) {
      setDeleteDialogOpen(true);
    }
  };

  // Handle edit completion
  const completeEdit = async () => {
    const result = await handleEditSubmit();
    if (result) {
      setEditDialogOpen(false);
      resetEditState();
    }
    return result;
  };

  // Handle delete completion
  const completeDelete = async () => {
    const result = await handleDeleteConfirm();
    if (result) {
      setDeleteDialogOpen(false);
    }
    return result;
  };

  // Handle adding an envelope
  const completeAddEnvelope = async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }): Promise<boolean> => {
    return await handleAddEnvelope(envelope);
  };

  return {
    expenses,
    availableBudgets,
    selectedExpense: editingExpense,
    editTitle,
    setEditTitle,
    editBudget,
    setEditBudget,
    editDate,
    setEditDate,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleEnvelopeClick: handleEnvelopeClickWithDialog,
    handleDeleteClick: handleDeleteClickWithDialog,
    handleEditSubmit: completeEdit,
    handleDeleteConfirm: completeDelete,
    handleAddEnvelope: completeAddEnvelope,
    loadData,
    navigationCallback // Exposer le callback de navigation
  };
};
