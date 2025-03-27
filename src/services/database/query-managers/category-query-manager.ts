
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Category } from '../models/category';
import { categoryQueries } from '../queries/category-queries';
import { BaseQueryManager } from './base-query-manager';

export class CategoryQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Category[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return categoryQueries.getAll(db);
    } catch (error) {
      console.error("Error getting categories:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les catégories"
      });
      return [];
    }
  }

  async add(category: Category): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      categoryQueries.add(db, category);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie"
      });
      throw error;
    }
  }

  async update(category: Category): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      categoryQueries.update(db, category);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie"
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success || !id) return;
      const db = this.getDb();
      categoryQueries.delete(db, id);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la catégorie"
      });
      throw error;
    }
  }
}
