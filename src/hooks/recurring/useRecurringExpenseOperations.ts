import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for recurring expense operations (add, update, delete)
 */
export const useRecurringExpenseOperations = (
  setRecurringExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
  loadData: () => Promise<void>
) => {
  const { toast } = useToast();
  const { currentDashboardId } = useDashboardContext();

  const handleAddExpense = async (newExpense: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    try {
      if (newExpense.type !== "expense") {
        throw new Error("Type must be 'expense'");
      }
      
      if (!newExpense.linkedBudgetId) {
        throw new Error("Le budget associé est obligatoire pour une dépense");
      }
      
      // Always use the current dashboard ID
      console.log("useRecurringExpenseOperations - Adding recurring expense with dashboardId:", currentDashboardId);
      
      const expense: Expense = {
        id: uuidv4(), 
        ...newExpense,
        type: "expense",
        spent: 0,
        isRecurring: true,
        dashboardId: currentDashboardId,
        linkedBudgetId: newExpense.linkedBudgetId
      };
      
      await db.addExpense(expense);
      setRecurringExpenses(prev => [...prev, expense]);
      
      toast({
        title: "Succès",
        description: "Nouvelle dépense récurrente ajoutée"
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense récurrente"
      });
      return false;
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      // Ensure the expense is still recurring
      const expense: Expense = {
        ...updatedExpense,
        type: "expense",
        isRecurring: true,
        // Keep existing dashboardId or use current context
        dashboardId: updatedExpense.dashboardId || 
                    (currentDashboardId === "budget" ? "default" : currentDashboardId)
      };
      
      console.log("useRecurringExpenseOperations - Updating expense with data:", expense);
      await db.updateExpense(expense);
      
      // Update the local state
      setRecurringExpenses(prev => 
        prev.map(item => item.id === expense.id ? expense : item)
      );
      
      toast({
        title: "Succès",
        description: "Dépense récurrente mise à jour"
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense récurrente"
      });
      return false;
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await db.deleteExpense(id);
      setRecurringExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Succès",
        description: "Dépense récurrente supprimée"
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense récurrente"
      });
      return false;
    }
  };

  return {
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense
  };
};
