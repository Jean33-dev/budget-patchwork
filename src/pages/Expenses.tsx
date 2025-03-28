
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Database, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { db } from "@/services/database";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { toast } from "@/components/ui/use-toast";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(1);
  const maxRetryAttempts = 10; // Augmenté pour plus de tentatives
  
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

  // Auto-retry on initial load failure with exponential backoff
  useEffect(() => {
    if (error && initAttempted && retryAttempt < maxRetryAttempts) {
      console.log(`Auto-retrying due to error (attempt ${retryAttempt + 1}/${maxRetryAttempts})`);
      
      // Set a timer with exponential backoff for retries
      const retryDelay = Math.min(1000 * Math.pow(2, retryAttempt), 30000); // Max delay of 30 seconds
      console.log(`Waiting ${retryDelay}ms before retry...`);
      
      const timer = setTimeout(() => {
        handleRetry();
      }, retryDelay);
      
      return () => clearTimeout(timer);
    }
  }, [error, initAttempted, retryAttempt]);

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryAttempt(prev => Math.min(prev + 1, maxRetryAttempts));
    
    try {
      console.log(`Manual retry attempt ${retryAttempt + 1}/${maxRetryAttempts}`);
      
      // Importation dynamique de web-sqlite-adapter pour accéder à resetInitializationAttempts
      try {
        const { WebSQLiteAdapter } = await import('@/services/database/web-sqlite-adapter');
        WebSQLiteAdapter.resetInitializationAttempts?.();
        console.log("Reset WebSQLiteAdapter initialization attempts");
      } catch (e) {
        console.warn("Could not reset WebSQLiteAdapter attempts:", e);
      }
      
      // Réinitialiser les tentatives avant de réessayer
      db.resetInitializationAttempts?.();
      
      toast({
        title: "Nouvelle tentative",
        description: `Tentative de rechargement des données (${retryAttempt}/${maxRetryAttempts})`,
      });
      
      // Forcer le rechargement des données
      await loadData();
    } catch (e) {
      console.error("Retry failed:", e);
      toast({
        variant: "destructive",
        title: "Échec de la tentative",
        description: "Impossible de charger les données. Veuillez réessayer."
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Force a full page reload when all retries have failed
  const handleForceReload = () => {
    console.log("Forcing page reload...");
    window.location.reload();
  };

  // Clear cache and reload when other methods fail
  const handleClearCacheAndReload = () => {
    console.log("Clearing cache and reloading...");
    
    // Tenter de nettoyer le cache IndexedDB si disponible
    if (window.indexedDB) {
      try {
        const DBDeleteRequest = window.indexedDB.deleteDatabase('sqlitedb');
        DBDeleteRequest.onsuccess = () => {
          console.log("IndexedDB cache cleared successfully");
          // Tenter de nettoyer également le cache du Service Worker
          if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'CLEAR_CACHE'
            });
          }
          toast({
            title: "Cache vidé",
            description: "Rechargement de la page..."
          });
          setTimeout(() => window.location.reload(), 1000);
        };
        DBDeleteRequest.onerror = () => {
          console.error("Error clearing IndexedDB cache");
          window.location.reload();
        };
      } catch (e) {
        console.error("Failed to clear IndexedDB:", e);
        window.location.reload();
      }
    } else {
      // Fallback to just reloading if IndexedDB is not available
      window.location.reload();
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
            <p className="mb-3">
              Impossible de charger la base de données. {retryAttempt >= maxRetryAttempts ? 
                "Nombre maximal de tentatives atteint. Veuillez rafraîchir la page ou vider le cache." : 
                "Veuillez essayer de rafraîchir la page ou utiliser les options ci-dessous."}
            </p>
            <div className="mt-4 space-x-2 flex flex-wrap gap-2">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying || retryAttempt >= maxRetryAttempts} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {isRetrying ? "Tentative en cours..." : "Réessayer"}
              </Button>
              
              <Button 
                onClick={handleForceReload}
                className="flex items-center gap-2"
                variant={retryAttempt >= maxRetryAttempts ? "default" : "outline"}
              >
                <RefreshCw className="h-4 w-4" />
                Rafraîchir la page
              </Button>
              
              {retryAttempt >= 3 && (
                <Button 
                  onClick={handleClearCacheAndReload}
                  className="flex items-center gap-2"
                  variant="destructive"
                >
                  <Database className="h-4 w-4" />
                  Vider le cache et rafraîchir
                </Button>
              )}
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
