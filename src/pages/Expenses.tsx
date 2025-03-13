
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
  const mountedRef = useRef(true);
  const dataLoadedOnceRef = useRef(false);
  
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
    isSubmitting
  } = useExpenseManagement(budgetId);

  // Nettoyer le composant à sa destruction
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      console.log("Nettoyage du composant Expenses");
      mountedRef.current = false;
    };
  }, []);

  // Optimiser la fonction de chargement des données avec useCallback et une protection contre les chargements multiples
  const optimizedLoadData = useCallback(async () => {
    // Éviter les chargements simultanés et vérifier que le composant est toujours monté
    if (isLoadingRef.current || !mountedRef.current) {
      console.log("Chargement déjà en cours ou composant démonté, ignoré");
      return;
    }

    console.log("Démarrage du chargement optimisé des données, budgetId:", budgetId);
    isLoadingRef.current = true;

    try {
      await loadData();
      dataLoadedOnceRef.current = true;
      
      // Vérifier à nouveau que le composant est monté avant de mettre à jour l'état
      if (mountedRef.current) {
        console.log("Chargement optimisé des données terminé avec succès");
      }
    } catch (error) {
      console.error("Erreur lors du chargement optimisé des données:", error);
    } finally {
      // S'assurer que le flag est réinitialisé même en cas d'erreur
      if (mountedRef.current) {
        isLoadingRef.current = false;
      }
    }
  }, [budgetId, loadData]);

  // Recharger les données quand le budgetId change
  useEffect(() => {
    console.log("Effet de chargement des données déclenché, budgetId:", budgetId);
    // Ne charger qu'une seule fois au démarrage ou si budgetId change
    if (!dataLoadedOnceRef.current || budgetId !== undefined) {
      optimizedLoadData();
    }
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
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Expenses;
