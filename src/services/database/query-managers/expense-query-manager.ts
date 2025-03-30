
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Expense } from '../models/expense';
import { expenseQueries } from '../queries/expense-queries';
import { BaseQueryManager } from './base-query-manager';

export class ExpenseQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Expense[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      const db = this.getDb();
      return expenseQueries.getAll(db);
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
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      expenseQueries.add(db, expense);
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
      const success = await this.ensureParentInitialized();
      if (!success) return;
      const db = this.getDb();
      expenseQueries.update(db, expense);
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
      const success = await this.ensureParentInitialized();
      if (!success || !id) return;
      const db = this.getDb();
      expenseQueries.delete(db, id);
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
