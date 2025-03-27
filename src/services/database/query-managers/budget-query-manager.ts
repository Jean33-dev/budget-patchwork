
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Budget } from '../models/budget';
import { budgetQueries } from '../queries/budget-queries';
import { BaseQueryManager } from './base-query-manager';

export class BudgetQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Budget[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return budgetQueries.getAll(db);
    } catch (error) {
      console.error("Error getting budgets:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les budgets"
      });
      return [];
    }
  }

  async add(budget: Budget): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      budgetQueries.add(db, budget);
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le budget"
      });
      throw error;
    }
  }

  async update(budget: Budget): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      budgetQueries.update(db, budget);
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le budget"
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success || !id) return;
      const db = this.getDb();
      budgetQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le budget"
      });
      throw error;
    }
  }
}
