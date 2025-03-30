
import { useState, useEffect, useCallback } from "react";
import { db } from "@/services/database";
import { useToast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";

export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId?: string;
  date: string;
}

export type { Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  // Charger les données
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Initializing database...");
      await db.init();
      
      // Charger les budgets
      const loadedBudgets = await db.getBudgets();
      console.log('Budgets loaded:', loadedBudgets);
      setAvailableBudgets(loadedBudgets);
      
      // Charger les dépenses
      const loadedExpenses = await db.getExpenses();
      console.log('Expenses loaded:', loadedExpenses);
      setExpenses(loadedExpenses);
      
      setInitAttempted(true);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
      setError(error instanceof Error ? error : new Error("Failed to load data"));
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, [loadData, budgetId]);

  // Forcer le rechargement des données
  const forceReload = useCallback(async () => {
    if (isProcessing || isLoading) {
      toast({
        title: "Opération en cours",
        description: "Veuillez attendre la fin de l'opération en cours"
      });
      return;
    }
    
    try {
      await loadData();
      toast({
        title: "Données rechargées",
        description: "Les données ont été actualisées avec succès"
      });
    } catch (error) {
      console.error("Error reloading data:", error);
    }
  }, [isProcessing, isLoading, loadData, toast]);

  // Ajouter une dépense
  const handleAddEnvelope = useCallback(async (envelopeData: {
    title: string;
    budget: number;
    type: "expense";
    linkedBudgetId?: string;
    date: string;
  }) => {
    if (isProcessing) {
      toast({
        title: "Opération en cours",
        description: "Une opération est déjà en cours"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: envelopeData.title || "Sans titre",
        budget: envelopeData.budget || 0,
        spent: envelopeData.budget || 0,
        type: "expense",
        linkedBudgetId: budgetId || envelopeData.linkedBudgetId,
        date: envelopeData.date || new Date().toISOString().split('T')[0]
      };

      await db.addExpense(newExpense);
      setAddDialogOpen(false);
      
      toast({
        title: "Succès",
        description: "Dépense ajoutée avec succès"
      });
      
      await loadData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [budgetId, isProcessing, loadData, toast]);

  // Supprimer une dépense
  const handleDeleteExpense = useCallback(async (id: string) => {
    if (isProcessing) {
      toast({
        title: "Opération en cours",
        description: "Une opération est déjà en cours"
      });
      return;
    }

    try {
      setIsProcessing(true);
      await db.deleteExpense(id);
      
      toast({
        title: "Succès",
        description: "Dépense supprimée avec succès"
      });
      
      await loadData();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, loadData, toast]);

  // Mettre à jour une dépense
  const handleUpdateExpense = useCallback(async (expense: Expense) => {
    if (isProcessing) {
      toast({
        title: "Opération en cours",
        description: "Une opération est déjà en cours"
      });
      return;
    }

    try {
      setIsProcessing(true);
      await db.updateExpense(expense);
      
      toast({
        title: "Succès",
        description: "Dépense mise à jour avec succès"
      });
      
      await loadData();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, loadData, toast]);

  // Obtenir les dépenses filtrées par budgetId
  const filteredExpenses = budgetId 
    ? expenses.filter(expense => expense.linkedBudgetId === budgetId)
    : expenses;

  return {
    expenses: filteredExpenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    loadData,
    forceReload,
    isLoading,
    isProcessing,
    error,
    initAttempted
  };
};
