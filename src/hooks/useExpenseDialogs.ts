
import { useState } from "react";
import { ExpenseDialogState } from "@/types/expense";

export const useExpenseDialogs = () => {
  const [dialogState, setDialogState] = useState<ExpenseDialogState>({
    addDialogOpen: false,
    editDialogOpen: false,
    deleteDialogOpen: false,
    isDeleting: false
  });

  const setAddDialogOpen = (open: boolean) => {
    setDialogState(prev => ({ ...prev, addDialogOpen: open }));
  };

  const setEditDialogOpen = (open: boolean) => {
    setDialogState(prev => ({ ...prev, editDialogOpen: open }));
  };

  const setDeleteDialogOpen = (open: boolean) => {
    setDialogState(prev => ({ ...prev, deleteDialogOpen: open }));
  };

  return {
    ...dialogState,
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen
  };
};
