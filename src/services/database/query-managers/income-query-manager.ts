
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Income } from '../models/income';
import { incomeQueries } from '../queries/income-queries';

export class IncomeQueryManager {
  private parent: QueryManager;

  constructor(parent: QueryManager) {
    this.parent = parent;
  }

  async getAll(): Promise<Income[]> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return [];
      return incomeQueries.getAll(this.parent.db);
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

  async add(income: Income): Promise<void> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      incomeQueries.add(this.parent.db, income);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      incomeQueries.update(this.parent.db, income);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db || !id) return;
      incomeQueries.delete(this.parent.db, id);
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
