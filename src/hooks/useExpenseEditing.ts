
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
    console.log("Sélection de la dépense pour modification:", expense.id);
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
    console.log("Réinitialisation de l'état d'édition");
    setEditState({
      selectedExpense: null,
      editTitle: "",
      editBudget: 0,
      editDate: ""
    });
    setIsSubmitting(false);
  };

  const handleEditSubmit = async () => {
    if (!editState.selectedExpense) {
      console.error("Tentative de modification sans dépense sélectionnée");
      return false;
    }
    
    if (isSubmitting) {
      console.log("Soumission déjà en cours, ignorée");
      return false;
    }
    
    setIsSubmitting(true);
    console.log("Début de la mise à jour pour la dépense:", editState.selectedExpense.id);

    try {
      const updatedExpense: Expense = {
        ...editState.selectedExpense,
        title: editState.editTitle,
        budget: editState.editBudget,
        spent: editState.editBudget,
        date: editState.editDate
      };

      console.log("Mise à jour de la dépense:", updatedExpense);
      const updateResult = await db.updateExpense(updatedExpense);
      
      if (updateResult === false) {
        console.error("Échec de la mise à jour en base de données");
        throw new Error("Échec de la mise à jour en base de données");
      }

      // Mise à jour optimiste de l'état local
      setExpenses(prev => prev.map(expense => 
        expense.id === editState.selectedExpense?.id ? updatedExpense : expense
      ));
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${editState.editTitle}" a été mise à jour.`
      });

      // Rechargement des données après un délai
      setTimeout(async () => {
        await loadData();
        console.log("Données rechargées après modification");
      }, 300);
      
      setIsSubmitting(false);
      return true; // Return true to indicate success
    } catch (error) {
      console.error("Erreur lors de la modification de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la dépense"
      });
      setIsSubmitting(false);
      return false;
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
