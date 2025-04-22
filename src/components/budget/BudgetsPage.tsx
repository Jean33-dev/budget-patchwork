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
import { AlertCircle, RefreshCw, PlusCircle } from "lucide-react";

const BudgetsPage = () => {
  const navigate = useNavigate();
  const { 
    isRefreshing, 
    initializationSuccess,
    handleManualRefresh,
    initializeDatabase,
    attempt,
    maxAttempts
  } = useBudgetInitialization();
  
  const [retryCount, setRetryCount] = useState(0);
  
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

  useEffect(() => {
    console.log("BudgetsPage: initialization status changed:", initializationSuccess);
    if (initializationSuccess === false) {
      console.error("Database initialization failed, showing error state");
    }
  }, [initializationSuccess]);

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

  const handleForceReset = async () => {
    setRetryCount(0);
    localStorage.clear();
    await handleManualRefresh();
  };

  if (isLoading || initializationSuccess === null || isRefreshing) {
    return <BudgetLoadingState attempt={attempt} maxAttempts={maxAttempts} />;
  }

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
                <Button onClick={handleManualRefresh} className="mr-2" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer simplement
                </Button>
                <Button onClick={handleForceReset} variant="destructive">
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

      <div className="text-center">
        <Button 
          onClick={() => setAddDialogOpen(true)} 
          variant="outline" 
          size="lg" 
          className="mx-auto flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Ajouter un budget
        </Button>
      </div>

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
