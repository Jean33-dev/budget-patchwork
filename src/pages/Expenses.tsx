
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { db } from "@/services/database";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(1);
  const maxRetryAttempts = 3;
  
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

  // Auto-retry on initial load failure
  useEffect(() => {
    if (error && initAttempted && retryAttempt < maxRetryAttempts) {
      console.log(`Auto-retrying due to error (attempt ${retryAttempt + 1})`);
      handleRetry();
    }
  }, [error, initAttempted]);

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryAttempt(prev => Math.min(prev + 1, maxRetryAttempts));
    
    try {
      console.log(`Manual retry attempt ${retryAttempt + 1}/${maxRetryAttempts}`);
      // Réinitialiser les tentatives avant de réessayer
      db.resetInitializationAttempts?.();
      
      // Forcer le rechargement des données
      await loadData();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />
      
      {isLoading && (
        <BudgetLoadingState attempt={retryAttempt} maxAttempts={maxRetryAttempts} />
      )}
      
      {error && initAttempted && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription className="mt-2">
            Impossible de charger la base de données. {retryAttempt >= maxRetryAttempts ? 
              "Nombre maximal de tentatives atteint. Veuillez rafraîchir la page ou vider le cache." : 
              "Veuillez essayer de rafraîchir la page."}
            <div className="mt-4">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying || retryAttempt >= maxRetryAttempts} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? "Tentative en cours..." : "Réessayer"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
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
