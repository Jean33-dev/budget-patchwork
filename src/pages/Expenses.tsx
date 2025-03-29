
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { ExpenseErrorState } from "@/components/budget/ExpenseErrorState";
import { useExpenseRetry } from "@/hooks/useExpenseRetry";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

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
    handleDeleteExpense,
    handleUpdateExpense,
    isLoading,
    error,
    loadData,
    initAttempted
  } = useExpenseManagement(budgetId);

  const {
    isRetrying,
    retryAttempt,
    maxRetryAttempts,
    handleRetry,
    handleForceReload,
    handleClearCacheAndReload
  } = useExpenseRetry(loadData);

  // Ajouter un effet pour surveiller les erreurs
  useEffect(() => {
    if (error && !isLoading) {
      console.error("Erreur détectée dans la page Expenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement des dépenses"
      });
    }
  }, [error, isLoading]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      {isLoading && (
        <BudgetLoadingState attempt={retryAttempt} maxAttempts={maxRetryAttempts} />
      )}
      
      {error && initAttempted && (
        <ExpenseErrorState 
          retryAttempt={retryAttempt}
          maxRetryAttempts={maxRetryAttempts}
          isRetrying={isRetrying}
          handleRetry={handleRetry}
          handleForceReload={handleForceReload}
          handleClearCacheAndReload={handleClearCacheAndReload}
        />
      )}
      
      {!isLoading && !error && (
        <ExpenseList
          expenses={expenses}
          availableBudgets={availableBudgets}
          addDialogOpen={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
          handleAddEnvelope={handleAddEnvelope}
          handleDeleteExpense={handleDeleteExpense}
          handleUpdateExpense={handleUpdateExpense}
          defaultBudgetId={budgetId || undefined}
        />
      )}
    </div>
  );
};

export default Expenses;
