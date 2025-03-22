
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

  // Force la base de données à s'initialiser au premier chargement
  useEffect(() => {
    const ensureDbInitialized = async () => {
      console.log("Initialisation forcée de la base de données...");
      await db.init();
      console.log("Base de données initialisée");
      refreshData();
    };
    
    ensureDbInitialized();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await db.init();
      await refreshData();
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
