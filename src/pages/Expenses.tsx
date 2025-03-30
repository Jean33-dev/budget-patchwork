
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { ExpenseErrorState } from "@/components/budget/ExpenseErrorState";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    forceReload,
    isLoading,
    isProcessing,
    error,
    initAttempted
  } = useExpenseManagement(budgetId);

  // Effet pour surveiller les erreurs
  useEffect(() => {
    if (error && !isLoading && !isProcessing) {
      console.error("Erreur détectée dans la page Expenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement des dépenses"
      });
    }
  }, [error, isLoading, isProcessing]);

  // Fonction de retry simplifiée
  const handleRetry = async () => {
    forceReload();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={forceReload} 
          disabled={isLoading || isProcessing}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Recharger les données
        </Button>
      </div>
      
      {isLoading && (
        <BudgetLoadingState attempt={1} maxAttempts={1} />
      )}
      
      {error && initAttempted && !isProcessing && (
        <ExpenseErrorState 
          retryAttempt={1}
          maxRetryAttempts={3}
          isRetrying={false}
          handleRetry={handleRetry}
          handleForceReload={forceReload}
          handleClearCacheAndReload={() => window.location.reload()}
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
      
      {isProcessing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-lg font-medium">Opération en cours...</p>
              <p className="text-sm text-gray-500 text-center">
                Veuillez patienter pendant le traitement de votre demande.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
