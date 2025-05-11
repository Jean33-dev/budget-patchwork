
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { v4 as uuidv4 } from "uuid";

export type ExpenseFormData = {
  title: string;
  budget: number;
  type: "expense";
  linkedBudgetId: string;
  date: string;
  dashboardId?: string;
  isRecurring?: boolean;
};

export const expenseOperations = {
  async addExpense(data: ExpenseFormData): Promise<boolean> {
    try {
      console.log("expenseOperations.addExpense: Starting with data:", data);
      
      if (!data.linkedBudgetId) {
        console.error("expenseOperations.addExpense: Erreur - linkedBudgetId manquant");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le budget associé est obligatoire pour une dépense"
        });
        return false;
      }
      
      // Récupérer le dashboardId fourni ou du localStorage
      const dashboardId = data.dashboardId || 
        (typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null);
        
      if (!dashboardId) {
        console.error("expenseOperations.addExpense: Erreur - dashboardId manquant");
        toast({
          variant: "destructive",
          title: "Erreur", 
          description: "L'ID du tableau de bord est obligatoire pour une dépense"
        });
        return false;
      }
      
      console.log(`expenseOperations.addExpense: Using dashboardId: "${dashboardId}"`);
      
      // Stocker le dashboardId courant dans localStorage pour la récupération ultérieure
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentDashboardId', dashboardId);
      }
      
      const newExpense: Expense = {
        id: uuidv4(),
        title: data.title || "Sans titre",
        budget: Number(data.budget) || 0,
        spent: Number(data.budget) || 0,
        type: "expense",
        linkedBudgetId: data.linkedBudgetId,
        date: data.date || new Date().toISOString().split('T')[0],
        isRecurring: !!data.isRecurring,
        dashboardId: dashboardId
      };

      console.log("expenseOperations.addExpense: Created expense object:", newExpense);
      console.log("expenseOperations.addExpense: Expense dashboardId:", newExpense.dashboardId);
      
      await db.addExpense(newExpense);
      console.log("expenseOperations.addExpense: Expense added successfully");
      
      toast({
        title: "Dépense ajoutée",
        description: `La dépense "${data.title}" a été ajoutée avec succès.`
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
      console.log("expenseOperations.updateExpense: Starting with data:", expenseToUpdate);
      if (!expenseToUpdate.id) {
        console.error("expenseOperations.updateExpense: Missing expense ID");
        return false;
      }
      
      if (!expenseToUpdate.linkedBudgetId) {
        console.error("expenseOperations.updateExpense: Erreur - linkedBudgetId manquant");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le budget associé est obligatoire pour une dépense"
        });
        return false;
      }
      
      // Récupérer le dashboardId du contexte ou du localStorage si non fourni
      const dashboardId = expenseToUpdate.dashboardId || 
        (typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null);
        
      if (!dashboardId) {
        console.error("expenseOperations.updateExpense: Erreur - dashboardId manquant");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "L'ID du tableau de bord est obligatoire pour une dépense"
        });
        return false;
      }
      
      console.log(`expenseOperations.updateExpense: Using dashboardId: "${dashboardId}"`);
      
      // Stocker le dashboardId courant dans localStorage pour la récupération ultérieure
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentDashboardId', dashboardId);
      }
      
      const validatedExpense: Expense = {
        id: String(expenseToUpdate.id),
        title: String(expenseToUpdate.title || "Sans titre"),
        budget: Number(expenseToUpdate.budget) || 0,
        spent: Number(expenseToUpdate.spent) || Number(expenseToUpdate.budget) || 0,
        type: "expense",
        linkedBudgetId: String(expenseToUpdate.linkedBudgetId),
        date: String(expenseToUpdate.date || new Date().toISOString().split('T')[0]),
        isRecurring: !!expenseToUpdate.isRecurring,
        dashboardId: dashboardId
      };

      console.log("expenseOperations.updateExpense: Validated expense:", validatedExpense);
      console.log("expenseOperations.updateExpense: Expense dashboardId:", validatedExpense.dashboardId);
      
      await db.updateExpense(validatedExpense);
      console.log("expenseOperations.updateExpense: Expense updated successfully");
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${expenseToUpdate.title}" a été mise à jour.`
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
      console.log(`expenseOperations.deleteExpense: Starting with ID: ${expenseId}`);
      if (!expenseId) {
        console.error("expenseOperations.deleteExpense: Missing expense ID");
        return false;
      }
      
      await db.deleteExpense(String(expenseId));
      console.log(`expenseOperations.deleteExpense: Expense ${expenseId} deleted successfully`);
      
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting expense ${expenseId}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      return false;
    }
  }
};
