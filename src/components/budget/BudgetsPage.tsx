
import React from 'react';
import { useBudgetInteractions } from '@/hooks/useBudgetInteractions';
import { BudgetsHeader } from './BudgetsHeader';
import { EnvelopeManager } from '@/components/dashboard/EnvelopeManager';
import { AddEnvelopeDialog } from './AddEnvelopeDialog';
import { AddButton } from './AddButton';
import { Button } from '../ui/button';
import { BudgetDialogs } from './BudgetDialogs';

const BudgetsPage = () => {
  const {
    budgets,
    remainingAmount,
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
    handleEnvelopeClick,
    handleEditSubmit,
    handleViewExpenses,
    handleAddEnvelope,
    handleDeleteClick,
    handleDeleteConfirm
  } = useBudgetInteractions();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <BudgetsHeader />

      <EnvelopeManager 
        envelopes={budgets} 
        onAddClick={(type) => {
          if (type === 'budget') setAddDialogOpen(true);
        }}
        onEnvelopeClick={handleEnvelopeClick}
      />

      <AddEnvelopeDialog
        type="budget"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
      />

      <BudgetDialogs 
        budgets={budgets}
        selectedBudget={selectedBudget}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editBudget={editBudget}
        setEditBudget={setEditBudget}
        hasLinkedExpenses={hasLinkedExpenses}
        handleEditSubmit={handleEditSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
        handleViewExpenses={handleViewExpenses}
      />
    </div>
  );
};

export default BudgetsPage;
