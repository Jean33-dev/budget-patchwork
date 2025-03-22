
import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { useBudgets, Budget } from "@/hooks/useBudgets";
import { db } from "@/services/database";

export const useBudgetInteractions = (navigate: NavigateFunction) => {
  const { budgets, remainingAmount, addBudget, updateBudget, deleteBudget, isLoading, error, refreshData } = useBudgets();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  const [hasLinkedExpenses, setHasLinkedExpenses] = useState(false);

  // Refresh data whenever component mounts
  useEffect(() => {
    const initializeAndRefresh = async () => {
      try {
        // Always attempt to initialize the database first
        await db.init();
        console.log("Database initialization completed, refreshing data...");
        refreshData();
      } catch (error) {
        console.error("Error during database initialization:", error);
        // Still try to refresh data even if initialization fails
        refreshData();
      }
    };
    
    initializeAndRefresh();
  }, [refreshData]);

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

  return {
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
  };
};
