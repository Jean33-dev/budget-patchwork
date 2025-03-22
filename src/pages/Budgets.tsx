
import { useNavigate } from "react-router-dom";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { useState, useEffect } from "react";
import { BudgetsHeader } from "@/components/budget/BudgetsHeader";
import { useBudgets, Budget } from "@/hooks/useBudgets";
import { db } from "@/services/database";
import { BudgetLoadingState } from "@/components/budget/BudgetLoadingState";
import { BudgetErrorState } from "@/components/budget/BudgetErrorState";
import { RemainingAmountAlert } from "@/components/budget/RemainingAmountAlert";
import { RefreshButton } from "@/components/budget/RefreshButton";
import { EmptyBudgetState } from "@/components/budget/EmptyBudgetState";
import { BudgetDialogs } from "@/components/budget/BudgetDialogs";
import { toast } from "@/components/ui/use-toast";

const Budgets = () => {
  const navigate = useNavigate();
  const { budgets, remainingAmount, addBudget, updateBudget, deleteBudget, isLoading, error, refreshData } = useBudgets();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  const [hasLinkedExpenses, setHasLinkedExpenses] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force database initialization on first load with multiple retries
  useEffect(() => {
    const ensureDbInitialized = async () => {
      console.log("Starting database initialization process...");
      setIsRefreshing(true);
      
      try {
        // Try up to 3 times to initialize the database
        let success = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`Database initialization attempt ${attempt}...`);
          success = await db.init();
          if (success) {
            console.log(`Database successfully initialized on attempt ${attempt}`);
            break;
          }
          
          if (attempt < 3) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (!success) {
          toast({
            variant: "destructive",
            title: "Erreur d'initialisation",
            description: "Impossible d'initialiser la base de données après plusieurs tentatives. Veuillez rafraîchir la page."
          });
        } else {
          refreshData();
        }
      } catch (error) {
        console.error("Error initializing database:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Une erreur s'est produite lors de l'initialisation de la base de données. Veuillez rafraîchir la page."
        });
      } finally {
        setIsRefreshing(false);
      }
    };
    
    ensureDbInitialized();
  }, [refreshData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await db.init();
      if (success) {
        await refreshData();
        toast({
          title: "Actualisation terminée",
          description: "Les données ont été rafraîchies avec succès."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'actualisation",
          description: "Impossible d'initialiser la base de données. Veuillez réessayer."
        });
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'actualisation",
        description: "Une erreur s'est produite lors de l'actualisation des données."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEnvelopeClick = (envelope: Budget) => {
    setSelectedBudget(envelope);
    setEditTitle(envelope.title);
    setEditBudget(envelope.budget);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedBudget) return;

    const success = await updateBudget({
      ...selectedBudget,
      title: editTitle,
      budget: editBudget
    });

    if (success) {
      setEditDialogOpen(false);
      setSelectedBudget(null);
    }
  };

  const handleViewExpenses = (envelope: Budget) => {
    navigate(`/dashboard/budget/expenses?budgetId=${envelope.id}`);
  };

  const handleAddEnvelope = async (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
  }) => {
    if (envelope.type !== "budget") return;
    
    const budgetData = {
      title: envelope.title,
      budget: envelope.budget,
      type: "budget" as const
    };
    
    console.log("Ajout d'un nouveau budget:", budgetData);
    const success = await addBudget(budgetData);
    if (success) {
      setAddDialogOpen(false);
    }
  };

  const handleDeleteClick = async (envelope: Budget) => {
    setSelectedBudget(envelope);
    
    // Vérifier si le budget a des dépenses associées
    const expenses = await db.getExpenses();
    const linkedExpenses = expenses.filter(expense => expense.linkedBudgetId === envelope.id);
    setHasLinkedExpenses(linkedExpenses.length > 0);
    
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBudget) return;
    await deleteBudget(selectedBudget.id);
    setDeleteDialogOpen(false);
    setSelectedBudget(null);
  };

  if (isLoading) {
    return <BudgetLoadingState />;
  }

  if (error) {
    return <BudgetErrorState onRefresh={handleManualRefresh} isRefreshing={isRefreshing} />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <BudgetsHeader onNavigate={navigate} />
        <RefreshButton onRefresh={handleManualRefresh} isRefreshing={isRefreshing} />
      </div>

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

export default Budgets;
