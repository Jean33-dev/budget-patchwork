
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
      console.log("Starting addExpense operation");
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
      console.log("Expense added successfully:", newExpense.id);
      
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
      
      console.log("Starting updateExpense operation for ID:", expenseToUpdate.id);
      
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
      
      // Ne pas vérifier si la dépense existe ici, laissons la couche de base de données le faire
      // pour réduire les requêtes redondantes
      
      await db.updateExpense(validatedExpense);
      console.log("Expense updated successfully:", validatedExpense.id);
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
      
      console.log("Starting deleteExpense operation for ID:", expenseId);
      
      // Ne pas vérifier si la dépense existe ici, laissons la couche de base de données le faire
      // pour réduire les requêtes redondantes
      
      await db.deleteExpense(expenseId);
      console.log("Expense deleted successfully:", expenseId);
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      return false;
    }
  }
};
