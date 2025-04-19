
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BudgetsHeader } from "@/components/budget/BudgetsHeader";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { BudgetErrorState } from "@/components/budget/BudgetErrorState";
import { RemainingAmountAlert } from "@/components/budget/RemainingAmountAlert";
import { EmptyBudgetState } from "@/components/budget/EmptyBudgetState";
import { BudgetDialogs } from "@/components/budget/BudgetDialogs";
import { toast } from "@/components/ui/use-toast";
import { useBudgetInitialization } from "@/hooks/useBudgetInitialization";
import { useBudgetInteractions } from "@/hooks/useBudgetInteractions";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Database } from "lucide-react";
import { db } from "@/services/database";

const BudgetsPage = () => {
  const navigate = useNavigate();
  const { 
    isRefreshing, 
    initializationSuccess,
    handleManualRefresh,
    clearCacheAndRefresh,
    initializeDatabase,
    attempt,
    maxAttempts
  } = useBudgetInitialization();
  
  const [retryCount, setRetryCount] = useState(0);
  const [isCustomRetrying, setIsCustomRetrying] = useState(false);
  
  const {
    budgets,
    remainingAmount,
    isLoading,
    error,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedBudget,
    editTitle,
    setEditTitle,
    editBudget,
    setEditBudget,
    hasLinkedExpenses,
    handleEnvelopeClick,
    handleEditSubmit,
    handleViewExpenses,
    handleAddEnvelope,
    handleDeleteClick,
    handleDeleteConfirm
  } = useBudgetInteractions(navigate);

  // Afficher un message de diagnostic si l'initialisation échoue
  useEffect(() => {
    console.log("BudgetsPage: initialization status changed:", initializationSuccess);
    if (initializationSuccess === false) {
      console.error("Database initialization failed, showing error state");
    }
  }, [initializationSuccess]);

  // Réessayer l'initialisation si elle échoue
  useEffect(() => {
    if (initializationSuccess === false && retryCount < 2) {
      console.log(`Auto-retry initialization (${retryCount + 1}/2)...`);
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        initializeDatabase();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [initializationSuccess, retryCount, initializeDatabase]);

  // Function to retry loading data with a custom approach
  const handleCustomRetry = async () => {
    setIsCustomRetrying(true);
    try {
      console.log("Performing custom retry with database reset...");
      
      // Reset database initialization attempts
      db.resetInitializationAttempts();
      
      // Force initialization
      const success = await db.init();
      
      if (success) {
        console.log("Custom retry: Database initialized successfully");
        toast({
          title: "Base de données initialisée",
          description: "Rechargement des données en cours..."
        });
        
        // Reload page content after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Custom retry: Database initialization failed");
        toast({
          variant: "destructive",
          title: "Échec de l'initialisation",
          description: "Impossible d'initialiser la base de données."
        });
      }
    } catch (e) {
      console.error("Error during custom retry:", e);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation."
      });
    } finally {
      setIsCustomRetrying(false);
    }
  };

  // Fonction pour forcer une réinitialisation complète
  const handleForceReset = async () => {
    setRetryCount(0);
    await clearCacheAndRefresh();
  };

  // Afficher l'état de chargement tant que nous chargeons ou que nous n'avons pas encore essayé d'initialiser
  if (isLoading || initializationSuccess === null || isRefreshing) {
    return <BudgetLoadingState attempt={attempt} maxAttempts={maxAttempts} />;
  }

  // Afficher l'état d'erreur si l'initialisation a échoué ou s'il y a une erreur
  if (error || initializationSuccess === false) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <BudgetsHeader onNavigate={navigate} />
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Erreur de chargement</h3>
              <p className="text-sm mt-1">
                Impossible de charger la base de données. Veuillez essayer l'une des solutions suivantes:
              </p>
              <div className="mt-4 space-y-2">
                <Button 
                  onClick={handleManualRefresh} 
                  className="mr-2" 
                  variant="outline"
                  disabled={isCustomRetrying}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer simplement
                </Button>
                
                <Button 
                  onClick={handleCustomRetry} 
                  variant="outline"
                  disabled={isCustomRetrying}
                  className="mr-2"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isCustomRetrying ? "Réinitialisation en cours..." : "Réinitialiser la base de données"}
                </Button>
                
                <Button 
                  onClick={handleForceReset} 
                  variant="destructive"
                  disabled={isCustomRetrying}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réinitialiser complètement
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <BudgetsHeader onNavigate={navigate} />

      <RemainingAmountAlert remainingAmount={remainingAmount} />

      {budgets.length === 0 ? (
        <EmptyBudgetState />
      ) : (
        <EnvelopeList
          envelopes={budgets}
          type="budget"
          onAddClick={() => setAddDialogOpen(true)}
          onEnvelopeClick={handleEnvelopeClick}
          onViewExpenses={handleViewExpenses}
          onDeleteClick={handleDeleteClick}
        />
      )}

      <BudgetDialogs
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedBudget={selectedBudget}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editBudget={editBudget}
        setEditBudget={setEditBudget}
        hasLinkedExpenses={hasLinkedExpenses}
        handleAddEnvelope={handleAddEnvelope}
        handleEditSubmit={handleEditSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BudgetsPage;
