
import { useState, useCallback } from "react";
import { EditExpenseDialog } from "./EditExpenseDialog";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  linkedBudgetId?: string;
  date?: string;
}

interface ExpenseDialogsProps {
  selectedExpense: Envelope | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  editableTitle: string;
  setEditableTitle: (title: string) => void;
  editableBudget: number;
  setEditableBudget: (budget: number) => void;
  editableDate: string;
  setEditableDate: (date: string) => void;
  onConfirmEdit: () => void;
}

export const ExpenseDialogs = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  editableTitle,
  setEditableTitle,
  editableBudget,
  setEditableBudget,
  editableDate,
  setEditableDate,
  onConfirmEdit
}: ExpenseDialogsProps) => {
  return (
    <>
      <EditExpenseDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={editableTitle}
        onTitleChange={setEditableTitle}
        budget={editableBudget}
        onBudgetChange={setEditableBudget}
        date={editableDate}
        onDateChange={setEditableDate}
        onSubmit={onConfirmEdit}
      />
    </>
  );
};

export const useExpenseDialogState = (
  onUpdateExpense: ((expense: Envelope) => void) | undefined, 
  onDeleteExpense: ((id: string) => void) | undefined
) => {
  const [selectedExpense, setSelectedExpense] = useState<Envelope | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableBudget, setEditableBudget] = useState(0);
  const [editableDate, setEditableDate] = useState("");

  const handleEditClick = useCallback((envelope: Envelope) => {
    if (!envelope || !envelope.id) {
      console.error("Invalid expense data for edit");
      return;
    }
    
    console.log("handleEditClick: Setting selected expense:", envelope);
    setSelectedExpense(envelope);
    setEditableTitle(String(envelope.title || ""));
    setEditableBudget(Number(envelope.budget) || 0);
    setEditableDate(String(envelope.date || new Date().toISOString().split('T')[0]));
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((envelope: Envelope) => {
    if (!envelope || !envelope.id || !onDeleteExpense) {
      console.error("Invalid expense data for delete");
      return;
    }
    
    console.log("handleDeleteClick: Deleting expense directly without confirmation:", envelope);
    // Supprimer l'expense directement sans boîte de dialogue de confirmation
    onDeleteExpense(String(envelope.id));
  }, [onDeleteExpense]);

  const handleConfirmEdit = useCallback(() => {
    if (!selectedExpense || !selectedExpense.id || !onUpdateExpense) {
      console.error("Cannot update expense: missing data or update handler");
      setIsEditDialogOpen(false);
      return;
    }
    
    try {
      const updatedExpense = {
        ...selectedExpense,
        title: String(editableTitle || "Sans titre"),
        budget: Number(editableBudget) || 0,
        spent: Number(editableBudget) || 0, // Pour une dépense, spent == budget
        date: String(editableDate || new Date().toISOString().split('T')[0])
      };
      
      console.log("handleConfirmEdit: Updated expense:", updatedExpense);
      
      onUpdateExpense(updatedExpense);
    } catch (error) {
      console.error("Error updating expense:", error);
    } finally {
      setIsEditDialogOpen(false);
    }
  }, [selectedExpense, editableTitle, editableBudget, editableDate, onUpdateExpense]);

  return {
    selectedExpense,
    setSelectedExpense,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editableTitle,
    setEditableTitle,
    editableBudget,
    setEditableBudget,
    editableDate,
    setEditableDate,
    handleEditClick,
    handleDeleteClick,
    handleConfirmEdit
  };
};
