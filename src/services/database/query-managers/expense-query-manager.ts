
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Expense } from '../models/expense';
import { expenseQueries } from '../queries/expense-queries';

export class ExpenseQueryManager {
  private parent: QueryManager;

  constructor(parent: QueryManager) {
    this.parent = parent;
  }

  async getAll(): Promise<Expense[]> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return [];
      return expenseQueries.getAll(this.parent.db);
    } catch (error) {
      console.error("Error getting expenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les dépenses"
      });
      return [];
    }
  }

  async add(expense: Expense): Promise<void> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      expenseQueries.add(this.parent.db, expense);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense"
      });
      throw error;
    }
  }

  async update(expense: Expense): Promise<void> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db) return;
      expenseQueries.update(this.parent.db, expense);
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense"
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const success = await this.parent.ensureInitialized();
      if (!success || !this.parent.db || !id) return;
      expenseQueries.delete(this.parent.db, id);
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      throw error;
    }
  }
}
