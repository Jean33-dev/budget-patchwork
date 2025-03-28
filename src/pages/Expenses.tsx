
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { db } from "@/services/database";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const [isRetrying, setIsRetrying] = useState(false);
  
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

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
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
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Chargement des dépenses...</p>
          </div>
        </div>
      )}
      
      {error && initAttempted && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription className="mt-2">
            Impossible de charger la base de données. Veuillez essayer de rafraîchir la page.
            <div className="mt-4">
              <Button onClick={handleRetry} disabled={isRetrying} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
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
