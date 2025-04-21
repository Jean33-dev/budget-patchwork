
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";

export type ExpenseFormData = {
  title: string;
  budget: number;
  type: "expense";
  linkedBudgetId: string; // Maintenant obligatoire
  date: string;
  dashboardId?: string;
};

export const expenseOperations = {
  async addExpense(data: ExpenseFormData): Promise<boolean> {
    try {
      console.log("expenseOperations.addExpense: Starting with data:", data);
      
      if (!data.linkedBudgetId) {
        console.error("expenseOperations.addExpense: Erreur - linkedBudgetId manquant");
        throw new Error("Le budget associé est obligatoire pour une dépense");
      }
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: data.title || "Sans titre",
        budget: Number(data.budget) || 0,
        spent: Number(data.budget) || 0,
        type: "expense",
        linkedBudgetId: data.linkedBudgetId, // Maintenant obligatoire
        date: data.date || new Date().toISOString().split('T')[0],
        dashboardId: data.dashboardId || null
      };

      console.log("expenseOperations.addExpense: Created expense object:", newExpense);
      await db.addExpense(newExpense);
      console.log("expenseOperations.addExpense: Expense added successfully");
      
      return true;
    } catch (error) {
      console.error("Error adding expense:", error);
      return false;
    }
  },

  async updateExpense(expenseToUpdate: Expense): Promise<boolean> {
    try {
      console.log("expenseOperations.updateExpense: Starting with data:", expenseToUpdate);
      if (!expenseToUpdate.id) {
        console.error("expenseOperations.updateExpense: Missing expense ID");
        return false;
      }
      
      if (!expenseToUpdate.linkedBudgetId) {
        console.error("expenseOperations.updateExpense: Erreur - linkedBudgetId manquant");
        throw new Error("Le budget associé est obligatoire pour une dépense");
      }
      
      const validatedExpense: Expense = {
        id: String(expenseToUpdate.id),
        title: String(expenseToUpdate.title || "Sans titre"),
        budget: Number(expenseToUpdate.budget) || 0,
        spent: Number(expenseToUpdate.spent) || Number(expenseToUpdate.budget) || 0,
        type: "expense",
        linkedBudgetId: String(expenseToUpdate.linkedBudgetId), // Maintenant obligatoire
        date: String(expenseToUpdate.date || new Date().toISOString().split('T')[0]),
        dashboardId: expenseToUpdate.dashboardId || null
      };

      console.log("expenseOperations.updateExpense: Validated expense:", validatedExpense);
      await db.updateExpense(validatedExpense);
      console.log("expenseOperations.updateExpense: Expense updated successfully");
      
      return true;
    } catch (error) {
      console.error("Error updating expense:", error);
      return false;
    }
  },

  async deleteExpense(expenseId: string): Promise<boolean> {
    try {
      console.log(`expenseOperations.deleteExpense: Starting with ID: ${expenseId}`);
      if (!expenseId) {
        console.error("expenseOperations.deleteExpense: Missing expense ID");
        return false;
      }
      
      await db.deleteExpense(String(expenseId));
      console.log(`expenseOperations.deleteExpense: Expense ${expenseId} deleted successfully`);
      
      return true;
    } catch (error) {
      console.error(`Error deleting expense ${expenseId}:`, error);
      return false;
    }
  }
};
