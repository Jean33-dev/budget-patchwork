
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from '../query-manager';
import { Income } from '../models/income';
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
      const stmt = db.prepare("SELECT * FROM incomes");
      const result = [];
      
      while(stmt.step()) {
        const row = stmt.getAsObject();
        result.push({
          id: row.id as string,
          title: row.title as string,
          budget: row.budget as number,
          spent: row.spent as number,
          type: row.type as string,
          date: row.date as string,
          isRecurring: Boolean(row.isRecurring)
        });
      }
      
      stmt.free();
      return result;
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
      const stmt = db.prepare("SELECT * FROM incomes WHERE isRecurring = 1");
      const result = [];
      
      while(stmt.step()) {
        const row = stmt.getAsObject();
        result.push({
          id: row.id as string,
          title: row.title as string,
          budget: row.budget as number,
          spent: row.spent as number,
          type: row.type as string,
          date: row.date as string,
          isRecurring: true
        });
      }
      
      stmt.free();
      return result;
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
      const stmt = db.prepare(`
        INSERT INTO incomes (id, title, budget, spent, type, date, isRecurring)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        income.id,
        income.title,
        income.budget,
        income.spent,
        income.type,
        income.date,
        income.isRecurring ? 1 : 0
      ]);
      
      stmt.free();
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
      const stmt = db.prepare(`
        UPDATE incomes 
        SET title = ?, budget = ?, spent = ?, type = ?, date = ?, isRecurring = ?
        WHERE id = ?
      `);
      
      stmt.run([
        income.title,
        income.budget,
        income.spent,
        income.type,
        income.date,
        income.isRecurring ? 1 : 0,
        income.id
      ]);
      
      stmt.free();
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
      if (!success) return;
      
      const db = this.getDb();
      const stmt = db.prepare("DELETE FROM incomes WHERE id = ?");
      stmt.run([id]);
      stmt.free();
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
