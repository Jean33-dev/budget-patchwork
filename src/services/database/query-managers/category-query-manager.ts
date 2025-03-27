
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Category } from '../models/category';
import { categoryQueries } from '../queries/category-queries';

export class CategoryQueryManager {
  private parent: QueryManager;

  constructor(parent: QueryManager) {
    this.parent = parent;
  }

  async getAll(): Promise<Category[]> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return [];
      return categoryQueries.getAll(this.parent.db);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      categoryQueries.add(this.parent.db, category);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      categoryQueries.update(this.parent.db, category);
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
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db || !id) return;
      categoryQueries.delete(this.parent.db, id);
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
