
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
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return incomeQueries.getAll(db);
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
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return incomeQueries.getRecurring(db);
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
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      incomeQueries.add(db, income);
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
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      incomeQueries.update(db, income);
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
      const success = await this.ensureParentInitialized();
      if (!success || !id) return;
      const db = this.getDb();
      incomeQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting income:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le revenu"
      });
      throw error;
    }
  }
}
