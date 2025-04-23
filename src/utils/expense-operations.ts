
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { v4 as uuidv4 } from "uuid";

export type ExpenseFormData = {
  title: string;
  budget: number;
  type: "expense";
  linkedBudgetId: string; // Already marked as required
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
      
      if (!data.dashboardId) {
        console.error("expenseOperations.addExpense: Warning - dashboardId is missing, using default");
      }
      
      const newExpense: Expense = {
        id: uuidv4(),
        title: data.title || "Sans titre",
        budget: Number(data.budget) || 0,
        spent: Number(data.budget) || 0,
        type: "expense",
        linkedBudgetId: data.linkedBudgetId, // Maintenant obligatoire
        date: data.date || new Date().toISOString().split('T')[0],
        dashboardId: data.dashboardId || "default"
      };

      console.log("expenseOperations.addExpense: Created expense object:", newExpense);
      console.log("expenseOperations.addExpense: Expense dashboardId:", newExpense.dashboardId);
      
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
      
      if (!expenseToUpdate.dashboardId) {
        console.error("expenseOperations.updateExpense: Warning - dashboardId is missing, using default");
      }
      
      const validatedExpense: Expense = {
        id: String(expenseToUpdate.id),
        title: String(expenseToUpdate.title || "Sans titre"),
        budget: Number(expenseToUpdate.budget) || 0,
        spent: Number(expenseToUpdate.spent) || Number(expenseToUpdate.budget) || 0,
        type: "expense",
        linkedBudgetId: String(expenseToUpdate.linkedBudgetId), // Maintenant obligatoire
        date: String(expenseToUpdate.date || new Date().toISOString().split('T')[0]),
        dashboardId: expenseToUpdate.dashboardId || "default"
      };

      console.log("expenseOperations.updateExpense: Validated expense:", validatedExpense);
      console.log("expenseOperations.updateExpense: Expense dashboardId:", validatedExpense.dashboardId);
      
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
