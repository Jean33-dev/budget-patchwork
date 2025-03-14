
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
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
  } = useExpenseManagement(budgetId);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      <ExpenseList
        expenses={expenses}
        availableBudgets={availableBudgets}
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        handleAddEnvelope={handleAddEnvelope}
        defaultBudgetId={budgetId || undefined}
      />
    </div>
  );
};

export default Expenses;
