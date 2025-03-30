
import { useState, useCallback, useEffect } from "react";
import { useExpenseData } from "./useExpenseData";
import { expenseOperations, ExpenseFormData } from "@/utils/expense-operations";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";
import { toast } from "@/components/ui/use-toast";

export type { Expense, Budget };

export const useExpenseManagement = (budgetId: string | null) => {
  const { expenses, availableBudgets, isLoading, error, initAttempted, loadData } = useExpenseData(budgetId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);

  // Effet pour recharger les données après une opération
  useEffect(() => {
    if (needsReload && !isProcessing && !isLoading) {
      const timer = setTimeout(() => {
        console.log("Rechargement automatique des données après opération");
        loadData().catch(err => {
          console.error("Erreur lors du rechargement automatique des données:", err);
        });
        setNeedsReload(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [needsReload, isProcessing, isLoading, loadData]);

  const handleAddEnvelope = useCallback(async (envelopeData: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }) => {
    if (envelopeData.type !== "expense") {
      return;
    }

    if (isProcessing) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const expenseData: ExpenseFormData = {
        title: envelopeData.title,
        budget: envelopeData.budget,
        type: "expense",
        linkedBudgetId: budgetId || envelopeData.linkedBudgetId,
        date: envelopeData.date || new Date().toISOString().split('T')[0]
      };

      const success = await expenseOperations.addExpense(expenseData);
      
      if (success) {
        setAddDialogOpen(false);
        setNeedsReload(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [budgetId, isProcessing]);

  const handleDeleteExpense = useCallback(async (id: string) => {
    if (!id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de dépense manquant"
      });
      return;
    }

    if (isProcessing) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return;
    }

    setIsProcessing(true);
    console.log(`Suppression de la dépense ${id} commencée`);

    try {
      const success = await expenseOperations.deleteExpense(id);
      
      if (success) {
        console.log(`Suppression de la dépense ${id} réussie`);
        setNeedsReload(true);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la dépense ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const handleUpdateExpense = useCallback(async (updatedExpense: Expense) => {
    if (!updatedExpense?.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Données de dépense invalides"
      });
      return;
    }

    if (isProcessing) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Une opération est déjà en cours, veuillez patienter"
      });
      return;
    }

    setIsProcessing(true);
    console.log(`Mise à jour de la dépense ${updatedExpense.id} commencée`);

    try {
      const success = await expenseOperations.updateExpense(updatedExpense);
      
      if (success) {
        console.log(`Mise à jour de la dépense ${updatedExpense.id} réussie`);
        setNeedsReload(true);
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la dépense ${updatedExpense.id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la dépense"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  // Fonction pour forcer un rechargement manuel des données
  const forceReload = useCallback(async () => {
    if (isProcessing || isLoading) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Veuillez attendre la fin de l'opération en cours"
      });
      return;
    }
    
    setIsProcessing(true);
    console.log("Forçage du rechargement des données");
    
    try {
      await loadData();
      toast({
        title: "Données rechargées",
        description: "Les données ont été actualisées avec succès"
      });
    } catch (error) {
      console.error("Erreur lors du rechargement forcé des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de recharger les données"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isLoading, loadData]);

  return {
    expenses,
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
