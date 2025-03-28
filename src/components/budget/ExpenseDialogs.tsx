
import { useState } from "react";
import { DeleteExpenseDialog } from "./DeleteExpenseDialog";
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
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  onConfirmDelete: () => void;
  editableTitle: string;
  setEditableTitle: (title: string) => void;
  editableBudget: number;
  setEditableBudget: (budget: number) => void;
  editableDate: string;
  setEditableDate: (date: string) => void;
  onConfirmEdit: () => void;
}

export const ExpenseDialogs = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  onConfirmDelete,
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
      <DeleteExpenseDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />

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

export const useExpenseDialogState = (onUpdateExpense: ((expense: Envelope) => void) | undefined) => {
  const [selectedExpense, setSelectedExpense] = useState<Envelope | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableBudget, setEditableBudget] = useState(0);
  const [editableDate, setEditableDate] = useState("");

  const handleEditClick = (envelope: Envelope) => {
    if (!envelope || !envelope.id) {
      console.error("Invalid expense data for edit");
      return;
    }
    
    setSelectedExpense(envelope);
    setEditableTitle(envelope.title || "");
    setEditableBudget(Number(envelope.budget) || 0);
    setEditableDate(envelope.date || new Date().toISOString().split('T')[0]);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (envelope: Envelope) => {
    if (!envelope || !envelope.id) {
      console.error("Invalid expense data for delete");
      return;
    }
    
    setSelectedExpense(envelope);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmEdit = () => {
    if (!selectedExpense || !selectedExpense.id || !onUpdateExpense) {
      console.error("Cannot update expense: missing data or update handler");
      setIsEditDialogOpen(false);
      return;
    }
    
    const updatedExpense = {
      ...selectedExpense,
      title: editableTitle || "Sans titre",
      budget: Number(editableBudget) || 0,
      spent: Number(editableBudget) || 0, // Pour une dépense, spent == budget
      date: editableDate || new Date().toISOString().split('T')[0]
    };
    
    console.log("Modification de la dépense confirmée:", updatedExpense);
    
    try {
      onUpdateExpense(updatedExpense);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense:", error);
    }
  };

  const handleConfirmDelete = () => {
    // Vérifier que cette fonction n'est pas utilisée directement, 
    // elle est fournie séparément dans l'interface ExpenseDialogsProps
    console.error("handleConfirmDelete called directly - this should not happen");
  };

  return {
    selectedExpense,
    setSelectedExpense,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
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
