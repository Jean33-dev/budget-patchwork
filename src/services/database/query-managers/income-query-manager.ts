
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Income } from '../models/income';
import { incomeQueries } from '../queries/income-queries';
import { BaseQueryManager } from './base-query-manager';

export class IncomeQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Income[]> {
    try {
      console.log("IncomeQueryManager.getAll: Starting...");
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("IncomeQueryManager.getAll: Parent not initialized");
        return [];
      }
      const db = this.getDb();
      if (!db) {
        console.error("IncomeQueryManager.getAll: Database is null");
        return [];
      }
      const result = incomeQueries.getAll(db);
      console.log(`IncomeQueryManager.getAll: Got ${result.length} incomes`);
      return result;
    } catch (error) {
      console.error("Error getting incomes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les revenus"
      });
      return [];
    }
  }

  async getRecurring(): Promise<Income[]> {
    try {
      console.log("IncomeQueryManager.getRecurring: Starting...");
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("IncomeQueryManager.getRecurring: Parent not initialized");
        return [];
      }
      const db = this.getDb();
      if (!db) {
        console.error("IncomeQueryManager.getRecurring: Database is null");
        return [];
      }
      
      // First try to get recurring incomes using the isRecurring column
      try {
        const result = incomeQueries.getRecurring(db);
        console.log(`IncomeQueryManager.getRecurring: Got ${result.length} recurring incomes`);
        return result;
      } catch (error) {
        // If the column doesn't exist, try to create it and return an empty array for now
        console.log("IncomeQueryManager.getRecurring: Adding isRecurring column to incomes table");
        try {
          db.exec("ALTER TABLE incomes ADD COLUMN isRecurring INTEGER DEFAULT 0");
          console.log("IncomeQueryManager.getRecurring: Column added successfully");
          return [];
        } catch (alterError) {
          console.error("Error adding isRecurring column:", alterError);
          return [];
        }
      }
    } catch (error) {
      console.error("Error getting recurring incomes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les revenus récurrents"
      });
      return [];
    }
  }

  async add(income: Income): Promise<void> {
    try {
      console.log("IncomeQueryManager.add: Starting...", income);
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("IncomeQueryManager.add: Parent not initialized");
        return;
      }
      const db = this.getDb();
      if (!db) {
        console.error("IncomeQueryManager.add: Database is null");
        return;
      }
      incomeQueries.add(db, income);
      console.log("IncomeQueryManager.add: Income added successfully");
    } catch (error) {
      console.error("Error adding income:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le revenu"
      });
      throw error;
    }
  }

  async update(income: Income): Promise<void> {
    try {
      console.log("IncomeQueryManager.update: Starting...", income);
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("IncomeQueryManager.update: Parent not initialized");
        return;
      }
      const db = this.getDb();
      if (!db) {
        console.error("IncomeQueryManager.update: Database is null");
        return;
      }
      incomeQueries.update(db, income);
      console.log("IncomeQueryManager.update: Income updated successfully");
    } catch (error) {
      console.error("Error updating income:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le revenu"
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log(`IncomeQueryManager.delete: Starting with ID: ${id}`);
      if (!id) {
        console.error("IncomeQueryManager.delete: ID is empty");
        return;
      }
      
      const success = await this.ensureParentInitialized();
      if (!success) {
        console.error("IncomeQueryManager.delete: Parent not initialized");
        return;
      }
      
      const db = this.getDb();
      if (!db) {
        console.error("IncomeQueryManager.delete: Database is null");
        return;
      }
      
      console.log(`IncomeQueryManager.delete: Deleting income with ID: ${id}`);
      incomeQueries.delete(db, id);
      console.log("IncomeQueryManager.delete: Income deleted successfully");
    } catch (error) {
      console.error(`Error deleting income with ID ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le revenu"
      });
      throw error;
    }
  }
}
