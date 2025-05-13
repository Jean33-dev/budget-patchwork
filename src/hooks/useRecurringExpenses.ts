
import { useRecurringExpenseData } from "./recurring/useRecurringExpenseData";
import { useRecurringExpenseOperations } from "./recurring/useRecurringExpenseOperations";
import { useRecurringExpenseUtilities } from "./recurring/useRecurringExpenseUtilities";

/**
 * Main hook that composes all recurring expense hooks
 */
export const useRecurringExpenses = () => {
  // Load data
  const {
    recurringExpenses,
    setRecurringExpenses,
    availableBudgets,
    isLoading,
    loadData,
    currentDate
  } = useRecurringExpenseData();

  // Operations
  const {
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense
  } = useRecurringExpenseOperations(setRecurringExpenses, loadData);

  // Utilities
  const { getBudgetName } = useRecurringExpenseUtilities(availableBudgets);

  return {
    recurringExpenses,
    availableBudgets,
    isLoading,
    loadData,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    getBudgetName,
    currentDate,
  };
};
