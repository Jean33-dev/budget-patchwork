
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Dashboard } from '../models/dashboard';
import { dashboardQueries } from '../queries/dashboard-queries';
import { BaseQueryManager } from './base-query-manager';

export class DashboardQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Dashboard[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return dashboardQueries.getAll(db);
    } catch (error) {
      console.error("Error getting dashboards:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les tableaux de bord"
      });
      return [];
    }
  }

  async add(dashboard: Dashboard): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      dashboardQueries.add(db, dashboard);
    } catch (error) {
      console.error("Error adding dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le tableau de bord"
      });
      throw error;
    }
  }

  async update(dashboard: Dashboard): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      dashboardQueries.update(db, dashboard);
    } catch (error) {
      console.error("Error updating dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le tableau de bord"
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success || !id) return;
      const db = this.getDb();
      dashboardQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le tableau de bord"
      });
      throw error;
    }
  }
}
