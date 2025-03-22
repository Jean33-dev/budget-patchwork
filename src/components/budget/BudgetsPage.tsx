
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BudgetsHeader } from "@/components/budget/BudgetsHeader";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { BudgetErrorState } from "@/components/budget/BudgetErrorState";
import { RemainingAmountAlert } from "@/components/budget/RemainingAmountAlert";
import { RefreshButton } from "@/components/budget/RefreshButton";
import { EmptyBudgetState } from "@/components/budget/EmptyBudgetState";
import { BudgetDialogs } from "@/components/budget/BudgetDialogs";
import { toast } from "@/components/ui/use-toast";
import { useBudgetInitialization } from "@/hooks/useBudgetInitialization";
import { useBudgetInteractions } from "@/hooks/useBudgetInteractions";

const BudgetsPage = () => {
  const navigate = useNavigate();
  const { 
    isRefreshing, 
    handleManualRefresh 
  } = useBudgetInitialization();
  
  const {
    budgets,
    remainingAmount,
    isLoading,
    error,
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

  if (isLoading) {
    return <BudgetLoadingState />;
  }

  if (error) {
    return <BudgetErrorState onRefresh={handleManualRefresh} isRefreshing={isRefreshing} />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <BudgetsHeader onNavigate={navigate} />
        <RefreshButton onRefresh={handleManualRefresh} isRefreshing={isRefreshing} />
      </div>

      <RemainingAmountAlert remainingAmount={remainingAmount} />

      {budgets.length === 0 ? (
        <EmptyBudgetState />
      ) : (
        <EnvelopeList
          envelopes={budgets}
          type="budget"
          onAddClick={() => setAddDialogOpen(true)}
          onEnvelopeClick={handleEnvelopeClick}
          onViewExpenses={handleViewExpenses}
          onDeleteClick={handleDeleteClick}
        />
      )}

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
