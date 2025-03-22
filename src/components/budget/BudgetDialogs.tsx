
import { useState } from "react";
import { AddEnvelopeDialog } from "./AddEnvelopeDialog";
import { EditBudgetDialog } from "./EditBudgetDialog";
import { DeleteBudgetDialog } from "./DeleteBudgetDialog";
import { Budget } from "@/hooks/useBudgets";

interface BudgetDialogsProps {
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedBudget: Budget | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editBudget: number;
  setEditBudget: (budget: number) => void;
  hasLinkedExpenses: boolean;
  handleAddEnvelope: (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
  }) => Promise<void>;
  handleEditSubmit: () => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
}

export const BudgetDialogs = ({
  addDialogOpen,
  setAddDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedBudget,
  editTitle,
  setEditTitle,
  editBudget,
  setEditBudget,
  hasLinkedExpenses,
  handleAddEnvelope,
  handleEditSubmit,
  handleDeleteConfirm
}: BudgetDialogsProps) => {
  return (
    <>
      <AddEnvelopeDialog
        type="budget"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
      />

      <EditBudgetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={editTitle}
        onTitleChange={setEditTitle}
        budget={editBudget}
        onBudgetChange={setEditBudget}
        onSubmit={handleEditSubmit}
      />

      <DeleteBudgetDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        hasLinkedExpenses={hasLinkedExpenses}
      />
    </>
  );
};
