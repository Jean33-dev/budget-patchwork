
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { ExpenseErrorState } from "@/components/budget/ExpenseErrorState";
import { useExpenseRetry } from "@/hooks/useExpenseRetry";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const [isContentLoading, setIsContentLoading] = useState(false);
  
  const {
    expenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    isLoading,
    isProcessing,
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

  // Effet pour gérer l'état de chargement global
  useEffect(() => {
    setIsContentLoading(isLoading || isProcessing);
  }, [isLoading, isProcessing]);

  // Effet pour surveiller les erreurs
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

  // Wrapper pour les opérations de suppression qui ajoute une gestion supplémentaire des erreurs
  const handleSafeDeleteExpense = async (id: string) => {
    try {
      await handleDeleteExpense(id);
    } catch (err) {
      console.error("Erreur non gérée lors de la suppression:", err);
      toast({
        variant: "destructive",
        title: "Erreur critique",
        description: "Une erreur inattendue est survenue. Veuillez rafraîchir la page."
      });
    }
  };

  // Wrapper pour les opérations de mise à jour qui ajoute une gestion supplémentaire des erreurs
  const handleSafeUpdateExpense = async (expense: any) => {
    try {
      await handleUpdateExpense(expense);
    } catch (err) {
      console.error("Erreur non gérée lors de la mise à jour:", err);
      toast({
        variant: "destructive",
        title: "Erreur critique",
        description: "Une erreur inattendue est survenue. Veuillez rafraîchir la page."
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      {(isLoading || isRetrying) && (
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
          handleDeleteExpense={handleSafeDeleteExpense}
          handleUpdateExpense={handleSafeUpdateExpense}
          defaultBudgetId={budgetId || undefined}
        />
      )}
      
      {isProcessing && !isLoading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p>Opération en cours...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
