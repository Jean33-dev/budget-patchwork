
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudgetInteractions } from '@/hooks/useBudgetInteractions';
import { BudgetsHeader } from './BudgetsHeader';
import { EnvelopeManager } from '@/components/dashboard/EnvelopeManager';
import { AddEnvelopeDialog } from './AddEnvelopeDialog';
import { BudgetDialogs } from './BudgetDialogs';

const BudgetsPage = () => {
  const navigate = useNavigate();
  
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
  } = useBudgetInteractions(navigate);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <BudgetsHeader onNavigate={navigate} />

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
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedBudget={selectedBudget}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editBudget={editBudget}
        setEditBudget={setEditBudget}
        hasLinkedExpenses={hasLinkedExpenses}
        handleAddEnvelope={handleAddEnvelope}
        handleEditSubmit={handleEditSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BudgetsPage;
