
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { toast } from "@/components/ui/use-toast";

export type ExpenseFormData = {
  title: string;
  budget: number;
  type: "expense";
  linkedBudgetId?: string;
  date: string;
};

export const expenseOperations = {
  async addExpense(data: ExpenseFormData): Promise<boolean> {
    try {
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: data.title || "Sans titre",
        budget: Number(data.budget) || 0,
        spent: Number(data.budget) || 0,
        type: "expense",
        linkedBudgetId: data.linkedBudgetId || null,
        date: data.date || new Date().toISOString().split('T')[0]
      };

      await db.addExpense(newExpense);
      
      toast({
        title: "Succès",
        description: `La dépense "${data.title}" a été ajoutée`
      });
      
      return true;
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense"
      });
      return false;
    }
  },

  async updateExpense(expenseToUpdate: Expense): Promise<boolean> {
    try {
      if (!expenseToUpdate?.id) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Données de dépense invalides"
        });
        return false;
      }

      const validatedExpense: Expense = {
        id: expenseToUpdate.id,
        title: expenseToUpdate.title || "Sans titre",
        budget: Number(expenseToUpdate.budget) || 0,
        spent: Number(expenseToUpdate.spent) || Number(expenseToUpdate.budget) || 0,
        type: "expense",
        linkedBudgetId: expenseToUpdate.linkedBudgetId || null,
        date: expenseToUpdate.date || new Date().toISOString().split('T')[0]
      };

      // Vérifier si la dépense existe
      const expenses = await db.getExpenses();
      const exists = expenses.some(e => e.id === validatedExpense.id);
      
      if (!exists) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La dépense n'existe plus"
        });
        return false;
      }

      await db.updateExpense(validatedExpense);
      
      toast({
        title: "Succès",
        description: `La dépense "${validatedExpense.title}" a été mise à jour`
      });
      
      return true;
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la dépense"
      });
      return false;
    }
  },

  async deleteExpense(expenseId: string): Promise<boolean> {
    try {
      if (!expenseId) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "ID de dépense manquant"
        });
        return false;
      }

      // Vérifier si la dépense existe
      const expenses = await db.getExpenses();
      const exists = expenses.some(e => e.id === expenseId);
      
      if (!exists) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La dépense n'existe plus"
        });
        return false;
      }

      await db.deleteExpense(expenseId);
      
      toast({
        title: "Succès",
        description: "La dépense a été supprimée"
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      return false;
    }
  }
};
