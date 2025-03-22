
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
        title: data.title,
        budget: data.budget,
        spent: data.budget,
        type: "expense",
        linkedBudgetId: data.linkedBudgetId,
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
        throw new Error("Invalid expense data for update");
      }
      
      console.log("Updating expense:", expenseToUpdate);
      
      // Delete old expense and add updated one (since we don't have a direct update method)
      await db.deleteExpense(expenseToUpdate.id);
      await db.addExpense(expenseToUpdate);
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${expenseToUpdate.title}" a été modifiée avec succès.`
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
        throw new Error("Missing expense ID for deletion");
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
