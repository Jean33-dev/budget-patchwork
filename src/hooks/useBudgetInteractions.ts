
import { useState, useCallback } from "react";
import { Budget } from "@/hooks/useBudgets";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";

/**
 * Hook pour gérer les interactions avec les budgets (ajout, édition, suppression)
 */
export const useBudgetInteractions = (
  budgets: Budget[],
  addBudget: (budget: Omit<Budget, "id" | "spent">) => Promise<boolean>,
  updateBudget: (budget: Budget) => Promise<boolean>,
  deleteBudget: (id: string) => Promise<boolean>,
  dashboardId: string | null
) => {
  // États pour les dialogues
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  
  // Récupération des dépenses pour vérification
  const { expenses } = useExpenseManagement(null);
  
  // État pour savoir si le budget sélectionné a des dépenses liées
  const [hasLinkedExpenses, setHasLinkedExpenses] = useState(false);

  /**
   * Ouvre le dialogue d'édition pour un budget
   */
  const handleEditBudget = useCallback((budget: Budget) => {
    setSelectedBudget(budget);
    setEditTitle(budget.title);
    setEditBudget(budget.budget);
    setEditDialogOpen(true);
  }, []);

  /**
   * Ouvre le dialogue de suppression pour un budget
   */
  const handleDeleteClick = useCallback((budget: Budget) => {
    setSelectedBudget(budget);
    
    // Vérifier si le budget a des dépenses liées
    const linkedExpenses = expenses.some(expense => 
      expense.linkedBudgetId === budget.id
    );
    setHasLinkedExpenses(linkedExpenses);
    
    setDeleteDialogOpen(true);
  }, [expenses]);

  /**
   * Gère la soumission du formulaire d'ajout
   */
  const handleAddEnvelope = useCallback(async (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
  }) => {
    const success = await addBudget({
      title: envelope.title,
      budget: envelope.budget,
      type: "budget",
      carriedOver: 0,
      dashboardId: dashboardId || ""
    });
    
    if (success) {
      setAddDialogOpen(false);
    }
  }, [addBudget, dashboardId]);

  /**
   * Gère la soumission du formulaire d'édition
   */
  const handleEditSubmit = useCallback(async () => {
    if (!selectedBudget) return;
    
    const updatedBudget = {
      ...selectedBudget,
      title: editTitle,
      budget: editBudget
    };
    
    const success = await updateBudget(updatedBudget);
    
    if (success) {
      setEditDialogOpen(false);
      setSelectedBudget(null);
    }
  }, [selectedBudget, editTitle, editBudget, updateBudget]);

  /**
   * Gère la suppression d'un budget
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedBudget) return;
    
    const success = await deleteBudget(selectedBudget.id);
    
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedBudget(null);
    }
  }, [selectedBudget, deleteBudget]);

  return {
    // États des dialogues
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    // États pour l'édition
    selectedBudget,
    editTitle,
    setEditTitle,
    editBudget,
    setEditBudget,
    hasLinkedExpenses,
    // Gestionnaires d'événements
    handleEditBudget,
    handleDeleteClick,
    handleAddEnvelope,
    handleEditSubmit,
    handleDeleteConfirm
  };
};
