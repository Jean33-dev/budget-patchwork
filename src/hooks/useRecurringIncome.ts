
import { useRecurringIncomeData } from "@/hooks/income/useRecurringIncomeData";
import { useRecurringIncomeDialogs } from "@/hooks/income/useRecurringIncomeDialogs";
import { useRecurringIncomeOperations } from "@/hooks/income/useRecurringIncomeOperations";

export const useRecurringIncome = () => {
  const {
    recurringIncomes,
    setRecurringIncomes,
    isLoading,
    loadRecurringIncomes
  } = useRecurringIncomeData();

  const {
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleIncomeClick
  } = useRecurringIncomeDialogs();

  const {
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome
  } = useRecurringIncomeOperations(
    loadRecurringIncomes,
    setAddDialogOpen,
    setEditDialogOpen,
    setSelectedIncome,
    setRecurringIncomes
  );

  return {
    recurringIncomes,
    isLoading,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    loadRecurringIncomes,
    handleAddIncome,
    handleEditIncome: (editedIncome: { title: string; budget: number; type: "income"; date: string }) => 
      handleEditIncome(editedIncome, selectedIncome),
    handleDeleteIncome,
    handleIncomeClick
  };
};
