
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/services/database';
import { Expense } from '@/services/database/models/expense';

export const useExpenseOperationHandlers = (
  budgetId: string | null,
  onSuccessCallback: () => Promise<void>,
  dashboardId: string | null
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  console.log("useExpenseOperationHandlers - initialized with dashboardId:", dashboardId, "budgetId:", budgetId);

  const handleAddEnvelope = useCallback(
    async (envelope: {
      title: string;
      budget: number;
      type: 'income' | 'expense' | 'budget';
      linkedBudgetId?: string;
      date: string;
    }) => {
      if (envelope.type !== 'expense') return;

      setIsProcessing(true);
      try {
        console.log("useExpenseOperationHandlers - Adding expense with data:", envelope, "dashboardId:", dashboardId);
        const expense: Expense = {
          id: uuidv4(),
          title: envelope.title,
          budget: envelope.budget,
          spent: envelope.budget, // Pour une dépense, spent == budget
          type: 'expense',
          linkedBudgetId: envelope.linkedBudgetId || budgetId || undefined,
          date: envelope.date || new Date().toISOString().split('T')[0],
          isRecurring: false,
          dashboardId: dashboardId // S'assurer que le dashboardId est toujours défini
        };
        
        console.log("useExpenseOperationHandlers - Constructed expense object:", expense);
        await db.addExpense(expense);
        
        toast({
          title: 'Succès',
          description: 'Dépense ajoutée avec succès'
        });
        
        await onSuccessCallback();
      } catch (error) {
        console.error('Error adding expense:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Une erreur est survenue lors de l'ajout de la dépense"
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [budgetId, onSuccessCallback, toast, dashboardId]
  );

  const handleDeleteExpense = useCallback(
    async (id: string) => {
      setIsProcessing(true);
      try {
        console.log(`useExpenseOperationHandlers - Deleting expense with ID: ${id}`);
        await db.deleteExpense(id);
        
        toast({
          title: 'Succès',
          description: 'Dépense supprimée avec succès'
        });
        
        await onSuccessCallback();
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression de la dépense'
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccessCallback, toast]
  );

  const handleUpdateExpense = useCallback(
    async (expense: Expense) => {
      setIsProcessing(true);
      try {
        console.log("useExpenseOperationHandlers - Updating expense:", expense);
        // S'assurer que le dashboardId est préservé lors de la mise à jour
        const updatedExpense: Expense = {
          ...expense,
          dashboardId: expense.dashboardId || dashboardId || "default"
        };
        
        console.log("useExpenseOperationHandlers - Final updated expense:", updatedExpense);
        await db.updateExpense(updatedExpense);
        
        toast({
          title: 'Succès',
          description: 'Dépense mise à jour avec succès'
        });
        
        await onSuccessCallback();
      } catch (error) {
        console.error('Error updating expense:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la mise à jour de la dépense'
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccessCallback, toast, dashboardId]
  );

  return {
    isProcessing,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense
  };
};
