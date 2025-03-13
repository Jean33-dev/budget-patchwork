
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  
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
  } = useExpenseManagement(budgetId);

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
