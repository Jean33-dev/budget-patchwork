
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";
import { v4 as uuidv4 } from "uuid";

export type IncomeFormData = {
  title: string;
  budget: number;
  type: "income";
  date: string;
  isRecurring?: boolean;
  dashboardId?: string;
};

export const incomeOperations = {
  async addIncome(data: IncomeFormData): Promise<boolean> {
    try {
      console.log("incomeOperations.addIncome: Starting with data:", data);
      
      // Récupérer le dashboardId du contexte si non fourni explicitement
      const dashboardId = data.dashboardId || 
        (typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null);
        
      if (!dashboardId) {
        console.error("incomeOperations.addIncome: Erreur - dashboardId manquant");
        throw new Error("L'ID du tableau de bord est obligatoire pour un revenu");
      }
      
      console.log(`incomeOperations.addIncome: Using dashboardId: "${dashboardId}"`);
      
      const newIncome: Income = {
        id: uuidv4(),
        title: data.title || "Sans titre",
        budget: Number(data.budget) || 0,
        spent: Number(data.budget) || 0,
        type: "income",
        date: data.date || new Date().toISOString().split('T')[0],
        isRecurring: !!data.isRecurring,
        dashboardId: dashboardId
      };

      console.log("incomeOperations.addIncome: Created income object:", newIncome);
      console.log("incomeOperations.addIncome: Income dashboardId:", newIncome.dashboardId);
      
      await db.addIncome(newIncome);
      console.log("incomeOperations.addIncome: Income added successfully");
      
      return true;
    } catch (error) {
      console.error("Error adding income:", error);
      return false;
    }
  },

  async updateIncome(incomeToUpdate: Income): Promise<boolean> {
    try {
      console.log("incomeOperations.updateIncome: Starting with data:", incomeToUpdate);
      if (!incomeToUpdate.id) {
        console.error("incomeOperations.updateIncome: Missing income ID");
        return false;
      }
      
      // Récupérer le dashboardId du contexte si non fourni explicitement
      const dashboardId = incomeToUpdate.dashboardId || 
        (typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null);
        
      if (!dashboardId) {
        console.error("incomeOperations.updateIncome: Erreur - dashboardId manquant");
        throw new Error("L'ID du tableau de bord est obligatoire pour un revenu");
      }
      
      console.log(`incomeOperations.updateIncome: Using dashboardId: "${dashboardId}"`);
      
      const validatedIncome: Income = {
        id: String(incomeToUpdate.id),
        title: String(incomeToUpdate.title || "Sans titre"),
        budget: Number(incomeToUpdate.budget) || 0,
        spent: Number(incomeToUpdate.spent) || Number(incomeToUpdate.budget) || 0,
        type: "income",
        date: String(incomeToUpdate.date || new Date().toISOString().split('T')[0]),
        isRecurring: !!incomeToUpdate.isRecurring,
        dashboardId: dashboardId
      };

      console.log("incomeOperations.updateIncome: Validated income:", validatedIncome);
      console.log("incomeOperations.updateIncome: Income dashboardId:", validatedIncome.dashboardId);
      
      await db.updateIncome(validatedIncome);
      console.log("incomeOperations.updateIncome: Income updated successfully");
      
      return true;
    } catch (error) {
      console.error("Error updating income:", error);
      return false;
    }
  },

  async deleteIncome(incomeId: string): Promise<boolean> {
    try {
      console.log(`incomeOperations.deleteIncome: Starting with ID: ${incomeId}`);
      if (!incomeId) {
        console.error("incomeOperations.deleteIncome: Missing income ID");
        return false;
      }
      
      await db.deleteIncome(String(incomeId));
      console.log(`incomeOperations.deleteIncome: Income ${incomeId} deleted successfully`);
      
      return true;
    } catch (error) {
      console.error(`Error deleting income ${incomeId}:`, error);
      return false;
    }
  }
};
