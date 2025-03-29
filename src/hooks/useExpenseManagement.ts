
import { useState, useCallback } from "react";
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
        toast({
          title: "Succès",
          description: "La dépense a été ajoutée avec succès"
        });
        await loadData();
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
  }, [budgetId, isProcessing, loadData]);

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

    try {
      console.log(`Tentative de suppression de la dépense avec l'ID: ${id}`);
      
      // Vérifier que la dépense existe avant de tenter de la supprimer
      const expenseExists = expenses.some(exp => exp.id === id);
      if (!expenseExists) {
        console.warn(`La dépense avec l'ID ${id} n'existe pas ou a déjà été supprimée`);
        toast({
          variant: "destructive",
          title: "Dépense introuvable",
          description: "La dépense que vous essayez de supprimer n'existe plus."
        });
        setIsProcessing(false);
        return;
      }
      
      // Effectuer la suppression
      const success = await expenseOperations.deleteExpense(id);
      
      if (success) {
        console.log(`Dépense ${id} supprimée avec succès`);
        toast({
          title: "Succès",
          description: "La dépense a été supprimée avec succès"
        });
        
        // Rechargement des données après la suppression
        try {
          await loadData();
        } catch (loadError) {
          console.error("Erreur lors du rechargement des données après suppression:", loadError);
        }
      } else {
        console.warn(`Échec de la suppression de la dépense ${id}`);
        toast({
          variant: "destructive",
          title: "Échec",
          description: "La suppression de la dépense a échoué"
        });
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
  }, [expenses, isProcessing, loadData]);

  const handleUpdateExpense = useCallback(async (updatedExpense: Expense) => {
    if (!updatedExpense || !updatedExpense.id) {
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

    try {
      console.log(`Tentative de mise à jour de la dépense avec l'ID: ${updatedExpense.id}`);
      
      // Vérifier que la dépense existe avant de tenter de la mettre à jour
      const expenseExists = expenses.some(exp => exp.id === updatedExpense.id);
      if (!expenseExists) {
        console.warn(`La dépense avec l'ID ${updatedExpense.id} n'existe pas ou a déjà été supprimée`);
        toast({
          variant: "destructive",
          title: "Dépense introuvable",
          description: "La dépense que vous essayez de modifier n'existe plus."
        });
        setIsProcessing(false);
        return;
      }
      
      // S'assurer que toutes les propriétés nécessaires sont définies
      const validatedExpense: Expense = {
        ...updatedExpense,
        type: "expense",
        spent: updatedExpense.budget, // Pour une dépense, spent == budget
        date: updatedExpense.date || new Date().toISOString().split('T')[0]
      };
      
      const success = await expenseOperations.updateExpense(validatedExpense);
      
      if (success) {
        console.log(`Dépense ${validatedExpense.id} mise à jour avec succès`);
        toast({
          title: "Succès",
          description: "La dépense a été modifiée avec succès"
        });
        
        // Rechargement des données après la mise à jour
        try {
          await loadData();
        } catch (loadError) {
          console.error("Erreur lors du rechargement des données après mise à jour:", loadError);
        }
      } else {
        console.warn(`Échec de la mise à jour de la dépense ${validatedExpense.id}`);
        toast({
          variant: "destructive",
          title: "Échec",
          description: "La modification de la dépense a échoué"
        });
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
  }, [expenses, isProcessing, loadData]);

  return {
    expenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    loadData,
    isLoading,
    isProcessing,
    error,
    initAttempted
  };
};
