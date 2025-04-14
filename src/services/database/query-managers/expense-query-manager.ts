
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Expense } from '../models/expense';
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
      const stmt = db.prepare("SELECT * FROM expenses");
      const result = [];
      
      while(stmt.step()) {
        const row = stmt.getAsObject();
        result.push({
          id: row.id as string,
          title: row.title as string,
          budget: row.budget as number,
          spent: row.spent as number,
          type: row.type as string,
          linkedBudgetId: row.linkedBudgetId as string,
          date: row.date as string,
          isRecurring: Boolean(row.isRecurring)
        });
      }
      
      stmt.free();
      return result;
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

  async getRecurring(): Promise<Expense[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      
      const db = this.getDb();
      const stmt = db.prepare("SELECT * FROM expenses WHERE isRecurring = 1");
      const result = [];
      
      while(stmt.step()) {
        const row = stmt.getAsObject();
        result.push({
          id: row.id as string,
          title: row.title as string,
          budget: row.budget as number,
          spent: row.spent as number,
          type: row.type as string,
          linkedBudgetId: row.linkedBudgetId as string,
          date: row.date as string,
          isRecurring: true
        });
      }
      
      stmt.free();
      return result;
    } catch (error) {
      console.error("Error getting recurring expenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les dépenses récurrentes"
      });
      return [];
    }
  }

  async add(expense: Expense): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      
      const db = this.getDb();
      const stmt = db.prepare(`
        INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        expense.id,
        expense.title,
        expense.budget,
        expense.spent,
        expense.type,
        expense.linkedBudgetId || null,
        expense.date,
        expense.isRecurring ? 1 : 0
      ]);
      
      stmt.free();
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
      const stmt = db.prepare(`
        UPDATE expenses 
        SET title = ?, budget = ?, spent = ?, type = ?, linkedBudgetId = ?, date = ?, isRecurring = ?
        WHERE id = ?
      `);
      
      stmt.run([
        expense.title,
        expense.budget,
        expense.spent,
        expense.type,
        expense.linkedBudgetId || null,
        expense.date,
        expense.isRecurring ? 1 : 0,
        expense.id
      ]);
      
      stmt.free();
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
      if (!success) return;
      
      const db = this.getDb();
      const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
      stmt.run([id]);
      stmt.free();
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
