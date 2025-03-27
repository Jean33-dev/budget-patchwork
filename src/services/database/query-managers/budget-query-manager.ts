
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Budget } from '../models/budget';
import { budgetQueries } from '../queries/budget-queries';

export class BudgetQueryManager {
  private parent: QueryManager;

  constructor(parent: QueryManager) {
    this.parent = parent;
  }

  async getAll(): Promise<Budget[]> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return [];
      return budgetQueries.getAll(this.parent.db);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      budgetQueries.add(this.parent.db, budget);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      budgetQueries.update(this.parent.db, budget);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db || !id) return;
      budgetQueries.delete(this.parent.db, id);
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
