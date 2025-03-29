
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
      
      return true;
    } catch (error) {
      console.error("Error adding expense:", error);
      return false;
    }
  },

  async updateExpense(expenseToUpdate: Expense): Promise<boolean> {
    try {
      if (!expenseToUpdate || !expenseToUpdate.id) {
        console.error("Invalid expense data for update");
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
        return false;
      }
      
      await db.updateExpense(validatedExpense);
      return true;
    } catch (error) {
      console.error("Error updating expense:", error);
      return false;
    }
  },

  async deleteExpense(expenseId: string): Promise<boolean> {
    try {
      if (!expenseId) {
        console.error("Missing expense ID for deletion");
        return false;
      }
      
      // Vérifier que la dépense existe avant de tenter la suppression
      const expenses = await db.getExpenses();
      const exists = expenses.some(e => e.id === expenseId);
      
      if (!exists) {
        console.warn(`La dépense avec l'ID ${expenseId} n'existe pas`);
        return false;
      }
      
      console.log(`Deleting expense with ID: ${expenseId}`);
      await db.deleteExpense(expenseId);
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      return false;
    }
  }
};
