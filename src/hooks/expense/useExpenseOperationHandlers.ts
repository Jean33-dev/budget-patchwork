
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "../models/expense";

export const useExpenseOperationHandlers = (
  budgetId: string | null,
  loadData: () => Promise<void>
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Add an expense
  const handleAddEnvelope = useCallback(async (envelopeData: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isFixed?: boolean;
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
      console.log("handleAddEnvelope: Starting with data:", envelopeData);
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: String(envelopeData.title || "Sans titre"),
        budget: Number(envelopeData.budget) || 0,
        spent: Number(envelopeData.budget) || 0,
        type: "expense",
        linkedBudgetId: budgetId ? String(budgetId) : envelopeData.linkedBudgetId ? String(envelopeData.linkedBudgetId) : null,
        date: String(envelopeData.date || new Date().toISOString().split('T')[0]),
        isFixed: envelopeData.isFixed || false
      };

      console.log("handleAddEnvelope: Created expense object:", newExpense);
      await db.addExpense(newExpense);
      
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

  // Delete an expense
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
      console.log(`handleDeleteExpense: Starting with ID: ${id}`);
      
      if (!id) {
        throw new Error("ID invalide pour la suppression");
      }
      
      await db.deleteExpense(String(id));
      
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

  // Update an expense
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
      console.log("handleUpdateExpense: Starting with data:", expense);
      
      if (!expense || !expense.id) {
        throw new Error("Données de dépense invalides pour la mise à jour");
      }
      
      const validatedExpense: Expense = {
        id: String(expense.id),
        title: String(expense.title || "Sans titre"),
        budget: Number(expense.budget) || 0,
        spent: Number(expense.spent || expense.budget) || 0,
        type: "expense",
        linkedBudgetId: expense.linkedBudgetId ? String(expense.linkedBudgetId) : null,
        date: String(expense.date || new Date().toISOString().split('T')[0]),
        isFixed: expense.isFixed || false
      };
      
      await db.updateExpense(validatedExpense);
      
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

  return {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
