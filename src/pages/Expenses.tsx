
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
  } = useExpenseManagement(budgetId);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const optimizedLoadData = useCallback(async () => {
    if (isLoadingRef.current || !mountedRef.current) {
      return;
    }

    isLoadingRef.current = true;

    try {
      await loadData();
      dataLoadedOnceRef.current = true;
    } finally {
      if (mountedRef.current) {
        isLoadingRef.current = false;
      }
    }
  }, [budgetId, loadData]);

  useEffect(() => {
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
      />
    </div>
  );
};

export default Expenses;
