
import { useState, useEffect, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useBudgets, Budget } from "@/hooks/useBudgets";
import { db } from "@/services/database";
import { toast } from "@/components/ui/use-toast";
import { useDashboardContext } from "./useDashboardContext";

export const useBudgetInteractions = (navigate: NavigateFunction) => {
  const { budgets, remainingAmount, addBudget, updateBudget, deleteBudget, isLoading, error, refreshData } = useBudgets();
  const { currentDashboardId } = useDashboardContext();
  
  // Define all state variables first to maintain consistent hook order
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  const [hasLinkedExpenses, setHasLinkedExpenses] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Create a callback for database initialization
  const initializeDatabase = useCallback(async () => {
    if (isInitializing || initializationAttempted) return;
    
    setIsInitializing(true);
    try {
      console.log("Starting database initialization...");
      // Try to initialize database up to 3 times
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`Database initialization attempt ${attempt}...`);
        success = await db.init();
        if (success) {
          console.log(`Database initialized successfully on attempt ${attempt}`);
          break;
        }
        // Wait a bit before retrying if not the last attempt
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (!success) {
        console.error("Failed to initialize database after multiple attempts");
        toast({
          variant: "destructive",
          title: "Database error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error during initialization:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while initializing the database."
      });
      return false;
    } finally {
      setIsInitializing(false);
      setInitializationAttempted(true);
    }
  }, [isInitializing, initializationAttempted]);

  // Refresh data whenever component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const success = await initializeDatabase();
        if (success) {
          console.log("Database initialization completed, refreshing data...");
          await refreshData();
        }
      } catch (error) {
        console.error("Error during data refresh:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while loading budget data."
        });
      }
    };
    
    loadData();
  }, [refreshData, initializeDatabase]);

  const handleEnvelopeClick = useCallback((envelope: Budget) => {
    setSelectedBudget(envelope);
    setEditTitle(envelope.title);
    setEditBudget(envelope.budget);
    setEditDialogOpen(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
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
  }, [selectedBudget, editTitle, editBudget, updateBudget]);

  const handleViewExpenses = useCallback((envelope: Budget) => {
    navigate(`/dashboard/budget/expenses?budgetId=${envelope.id}`);
  }, [navigate]);

  const handleAddEnvelope = useCallback(async (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
  }) => {
    if (envelope.type !== "budget") return;
    
    const budgetData = {
      title: envelope.title,
      budget: envelope.budget,
      type: "budget" as const,
      carriedOver: 0, // Add the required carriedOver property with a default value of 0
      dashboardId: currentDashboardId 
    };
    
    console.log("Ajout d'un nouveau budget:", budgetData);
    const success = await addBudget(budgetData);
    if (success) {
      setAddDialogOpen(false);
    }
  }, [addBudget, currentDashboardId]);

  const handleDeleteClick = useCallback(async (envelope: Budget) => {
    setSelectedBudget(envelope);
    
    // Vérifier si le budget a des dépenses associées
    const expenses = await db.getExpenses();
    const linkedExpenses = expenses.filter(expense => expense.linkedBudgetId === envelope.id);
    setHasLinkedExpenses(linkedExpenses.length > 0);
    
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedBudget) return;
    await deleteBudget(selectedBudget.id);
    setDeleteDialogOpen(false);
    setSelectedBudget(null);
  }, [selectedBudget, deleteBudget]);

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
