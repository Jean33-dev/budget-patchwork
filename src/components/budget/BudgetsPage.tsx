
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetsHeader } from "./BudgetsHeader";
import { EnvelopeGrid } from "./EnvelopeGrid";
import { BudgetsDialogs } from "./BudgetsDialogs";
import { BudgetLoadingState } from "./BudgetLoadingState";
import { BudgetLoadingError } from "./BudgetLoadingError";
import { EmptyBudgetState } from "./EmptyBudgetState";
import { RemainingAmountAlert } from "./RemainingAmountAlert";
import { useBudgetInitialization } from "@/hooks/useBudgetInitialization";
import { useBudgetInteractions } from "@/hooks/useBudgetInteractions";

const BudgetsPage = () => {
  const navigate = useNavigate();
  const { 
    budgets, 
    totalRevenues, 
    remainingAmount,
    totalBudgets,
    isLoading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    dashboardId
  } = useBudgets();

  // Initialisation personnalisée des budgets
  const { 
    initAttempted, 
    initFailed,
    initStatus,
    handleRetryInit
  } = useBudgetInitialization();

  // Hook pour la gestion des interactions avec les budgets
  const {
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
    handleEditBudget,
    handleDeleteClick,
    handleAddEnvelope,
    handleEditSubmit,
    handleDeleteConfirm
  } = useBudgetInteractions(
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    dashboardId
  );

  // Rediriger si on n'a pas sélectionné de dashboard
  useEffect(() => {
    if (initAttempted && !isLoading && !dashboardId) {
      navigate('/');
    }
  }, [initAttempted, isLoading, dashboardId, navigate]);

  // Si on est en cours de chargement
  if (isLoading && !error) {
    return <BudgetLoadingState />;
  }

  // Si une erreur s'est produite
  if (error || initFailed) {
    return (
      <BudgetLoadingError 
        onRetry={handleRetryInit}
        message="Impossible de charger les budgets. Veuillez réessayer."
      />
    );
  }

  // Si on n'a pas de budgets
  if (budgets.length === 0) {
    return (
      <div className="container py-6 max-w-6xl mx-auto">
        <BudgetsHeader 
          onAddClick={() => setAddDialogOpen(true)} 
        />
        <EmptyBudgetState onCreateClick={() => setAddDialogOpen(true)} />
        
        <BudgetsDialogs 
          addDialogOpen={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
          editDialogOpen={false}
          setEditDialogOpen={() => {}}
          deleteDialogOpen={false}
          setDeleteDialogOpen={() => {}}
          selectedBudget={null}
          editTitle=""
          setEditTitle={() => {}}
          editBudget={0}
          setEditBudget={() => {}}
          hasLinkedExpenses={false}
          handleAddEnvelope={handleAddEnvelope}
          handleEditSubmit={() => Promise.resolve()}
          handleDeleteConfirm={() => Promise.resolve()}
        />
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <BudgetsHeader 
        onAddClick={() => setAddDialogOpen(true)} 
      />
      
      <RemainingAmountAlert 
        totalRevenues={totalRevenues}
        remainingAmount={remainingAmount}
        totalBudgets={totalBudgets}
      />
      
      <EnvelopeGrid
        envelopes={budgets}
        onEdit={handleEditBudget}
        onDelete={handleDeleteClick}
        onClick={(budget) => navigate(`/budget/${budget.id}/expenses`)}
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
