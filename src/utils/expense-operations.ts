
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";

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

      console.log("Adding new expense:", newExpense);
      await db.addExpense(newExpense);
      
      toast({
        title: "Dépense ajoutée",
        description: `La dépense "${data.title}" a été créée avec succès.`
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
      if (!expenseToUpdate || !expenseToUpdate.id) {
        console.error("Invalid expense data for update");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Données de dépense invalides"
        });
        return false;
      }
      
      console.log("Updating expense:", expenseToUpdate);
      
      // S'assurer que tous les champs nécessaires sont présents
      const validatedExpense: Expense = {
        id: expenseToUpdate.id,
        title: expenseToUpdate.title || "Sans titre",
        budget: Number(expenseToUpdate.budget) || 0,
        spent: Number(expenseToUpdate.spent) || Number(expenseToUpdate.budget) || 0,
        type: "expense",
        linkedBudgetId: expenseToUpdate.linkedBudgetId || null,
        date: expenseToUpdate.date || new Date().toISOString().split('T')[0]
      };
      
      // Vérifier que la dépense existe avant de tenter la mise à jour
      const expenses = await db.getExpenses();
      const exists = expenses.some(e => e.id === validatedExpense.id);
      
      if (!exists) {
        console.warn(`La dépense avec l'ID ${validatedExpense.id} n'existe pas`);
        toast({
          variant: "destructive",
          title: "Dépense introuvable",
          description: "La dépense que vous essayez de modifier n'existe plus."
        });
        return false;
      }
      
      await db.updateExpense(validatedExpense);
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${validatedExpense.title}" a été modifiée avec succès.`
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
        console.error("Missing expense ID for deletion");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "ID de dépense manquant"
        });
        return false;
      }
      
      // Vérifier que la dépense existe avant de tenter la suppression
      const expenses = await db.getExpenses();
      const exists = expenses.some(e => e.id === expenseId);
      
      if (!exists) {
        console.warn(`La dépense avec l'ID ${expenseId} n'existe pas`);
        toast({
          variant: "destructive",
          title: "Dépense introuvable",
          description: "La dépense que vous essayez de supprimer n'existe plus."
        });
        return false;
      }
      
      console.log(`Deleting expense with ID: ${expenseId}`);
      await db.deleteExpense(expenseId);
      
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
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
