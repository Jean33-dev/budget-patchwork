
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense, ExpenseEditState } from "@/types/expense";

export const useExpenseEditing = (
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
  loadData: () => Promise<void>
) => {
  const { toast } = useToast();
  const [editState, setEditState] = useState<ExpenseEditState>({
    selectedExpense: null,
    editTitle: "",
    editBudget: 0,
    editDate: ""
  });

  const handleEnvelopeClick = (expense: Expense) => {
    setEditState({
      selectedExpense: expense,
      editTitle: expense.title,
      editBudget: expense.budget,
      editDate: expense.date
    });
    return true; // Return true to indicate dialog should open
  };

  const setEditTitle = (title: string) => {
    setEditState(prev => ({ ...prev, editTitle: title }));
  };

  const setEditBudget = (budget: number) => {
    setEditState(prev => ({ ...prev, editBudget: budget }));
  };

  const setEditDate = (date: string) => {
    setEditState(prev => ({ ...prev, editDate: date }));
  };

  const resetEditState = () => {
    setEditState({
      selectedExpense: null,
      editTitle: "",
      editBudget: 0,
      editDate: ""
    });
  };

  const handleEditSubmit = async () => {
    if (!editState.selectedExpense) return;

    try {
      const updatedExpense: Expense = {
        ...editState.selectedExpense,
        title: editState.editTitle,
        budget: editState.editBudget,
        spent: editState.editBudget,
        date: editState.editDate
      };

      await db.updateExpense(updatedExpense);

      setExpenses(prev => prev.map(expense => 
        expense.id === editState.selectedExpense?.id ? updatedExpense : expense
      ));
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${editState.editTitle}" a été mise à jour.`
      });

      await loadData();
      return true; // Return true to indicate success
    } catch (error) {
      console.error("Erreur lors de la modification de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la dépense"
      });
      return false;
    }
  };

  return {
    ...editState,
    setEditTitle,
    setEditBudget,
    setEditDate,
    handleEnvelopeClick,
    handleEditSubmit,
    resetEditState
  };
};
