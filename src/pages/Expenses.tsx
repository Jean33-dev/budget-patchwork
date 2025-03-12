
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { useEffect, useCallback, useRef } from "react";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const isLoadingRef = useRef(false);
  
  const {
    expenses,
    availableBudgets,
    selectedExpense,
    editTitle,
    setEditTitle,
    editBudget,
    setEditBudget,
    editDate,
    setEditDate,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleEnvelopeClick,
    handleDeleteClick,
    handleEditSubmit,
    handleDeleteConfirm,
    handleAddEnvelope,
    loadData,
  } = useExpenseManagement(budgetId);

  // Optimiser la fonction de chargement des données avec useCallback et une protection contre les chargements multiples
  const optimizedLoadData = useCallback(async () => {
    // Éviter les chargements simultanés
    if (isLoadingRef.current) {
      console.log("Chargement déjà en cours, ignoré");
      return;
    }

    console.log("Démarrage du chargement optimisé des données, budgetId:", budgetId);
    isLoadingRef.current = true;

    try {
      await loadData();
      console.log("Chargement optimisé des données terminé avec succès");
    } catch (error) {
      console.error("Erreur lors du chargement optimisé des données:", error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [budgetId, loadData]);

  // Recharger les données quand le budgetId change
  useEffect(() => {
    console.log("Effet de chargement des données déclenché, budgetId:", budgetId);
    optimizedLoadData();
  }, [budgetId, optimizedLoadData]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      <ExpenseList
        expenses={expenses}
        availableBudgets={availableBudgets}
        selectedExpense={selectedExpense}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editBudget={editBudget}
        setEditBudget={setEditBudget}
        editDate={editDate}
        setEditDate={setEditDate}
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        handleEnvelopeClick={handleEnvelopeClick}
        handleDeleteClick={handleDeleteClick}
        handleEditSubmit={handleEditSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
        handleAddEnvelope={handleAddEnvelope}
        defaultBudgetId={budgetId || undefined}
      />
    </div>
  );
};

export default Expenses;
