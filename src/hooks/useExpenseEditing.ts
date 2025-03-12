
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnvelopeClick = (expense: Expense) => {
    if (isSubmitting) return false;
    
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
    if (!editState.selectedExpense || isSubmitting) return false;

    setIsSubmitting(true);

    try {
      const updatedExpense: Expense = {
        ...editState.selectedExpense,
        title: editState.editTitle,
        budget: editState.editBudget,
        spent: editState.editBudget,
        date: editState.editDate
      };

      // Update UI immediately for better responsiveness
      setExpenses(prev => prev.map(expense => 
        expense.id === editState.selectedExpense?.id ? updatedExpense : expense
      ));
      
      // Perform database update asynchronously
      await db.updateExpense(updatedExpense);
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${editState.editTitle}" a été mise à jour.`
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la modification de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la dépense"
      });
      // Recharger les données en cas d'erreur pour restaurer l'état précédent
      await loadData();
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...editState,
    isSubmitting,
    setEditTitle,
    setEditBudget,
    setEditDate,
    handleEnvelopeClick,
    handleEditSubmit,
    resetEditState
  };
};
