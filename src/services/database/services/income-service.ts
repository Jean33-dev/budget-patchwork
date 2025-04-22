import { Income } from '../models/income';
import { BaseService } from './base-service';
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling income-related database operations
 */
export class IncomeService extends BaseService {
  /**
   * Retrieves all incomes
   */
  async getIncomes(): Promise<Income[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM incomes");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'income' as const,
        date: row.date,
        isRecurring: Boolean(row.isRecurring),
        dashboardId: row.dashboardId || null
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus:", error);
      return [];
    }
  }

  /**
   * Retrieves recurring incomes
   */
  async getRecurringIncomes(): Promise<Income[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM incomes WHERE isRecurring = 1");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'income' as const,
        date: row.date,
        isRecurring: true,
        dashboardId: row.dashboardId || null
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus récurrents:", error);
      return [];
    }
  }

  /**
   * Adds a new income
   */
  async addIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    const idToUse = income.id || uuidv4();
    await adapter!.run(
      'INSERT INTO incomes (id, title, budget, spent, type, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [idToUse, income.title, income.budget, income.spent, income.type, income.date, income.isRecurring ? 1 : 0, income.dashboardId || null]
    );
  }

  /**
   * Updates an existing income
   */
  async updateIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ?, isRecurring = ?, dashboardId = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.isRecurring ? 1 : 0, income.dashboardId || null, income.id]
    );
  }

  /**
   * Deletes an income
   */
  async deleteIncome(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM incomes WHERE id = ?', [id]);
  }

  /**
   * Copy a recurring income to a specific month
   */
  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    try {
      if (!await this.ensureInitialized()) return;
      
      // Get the recurring income
      const incomes = await this.getIncomes();
      const recurringIncome = incomes.find(income => income.id === incomeId && income.isRecurring);
      
      if (!recurringIncome) {
        throw new Error("Revenu récurrent non trouvé");
      }
      
      // Create a new income based on the recurring one
      const newIncome: Income = {
        id: `${recurringIncome.id}_copy_${Date.now()}`,
        title: recurringIncome.title,
        budget: recurringIncome.budget,
        spent: recurringIncome.budget, // Set spent to budget for income
        type: 'income',
        date: targetDate,
        isRecurring: false, // The copy is not recurring
        dashboardId: recurringIncome.dashboardId || null
      };
      
      await this.addIncome(newIncome);
      
      toast({
        title: "Succès",
        description: `Le revenu récurrent "${recurringIncome.title}" a été ajouté au mois actuel.`
      });
    } catch (error) {
      console.error("Erreur lors de la copie du revenu récurrent :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le revenu récurrent"
      });
    }
  }
}
