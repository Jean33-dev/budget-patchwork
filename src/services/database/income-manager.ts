
import { BaseDatabaseManager } from './base-database-manager';
import { Income } from './models/income';
import { incomeQueries } from './queries/income-queries';

export class IncomeManager extends BaseDatabaseManager {
  async getIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return incomeQueries.getAll(this.db);
  }

  async addIncome(income: Income): Promise<boolean> {
    try {
      console.log("IncomeManager - Ajout revenu avec montant:", income.budget);
      await this.ensureInitialized();
      incomeQueries.add(this.db, income);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu:", error);
      return false;
    }
  }

  async updateIncome(income: Income): Promise<boolean> {
    try {
      console.log("IncomeManager - Mise à jour revenu avec montant:", income.budget);
      await this.ensureInitialized();
      incomeQueries.update(this.db, income);
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du revenu:", error);
      return false;
    }
  }

  async deleteIncome(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      incomeQueries.delete(this.db, id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu:", error);
      return false;
    }
  }
}
