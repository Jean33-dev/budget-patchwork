
import { BaseDatabaseManager } from './base-database-manager';
import { Income } from './models/income';
import { incomeQueries } from './queries/income-queries';

export class IncomeManager extends BaseDatabaseManager {
  async getIncomes(): Promise<Income[]> {
    try {
      await this.ensureInitialized();
      return incomeQueries.getAll(this.db);
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus:", error);
      return [];
    }
  }

  async addIncome(income: Income): Promise<void> {
    try {
      await this.ensureInitialized();
      incomeQueries.add(this.db, income);
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un revenu:", error);
      return Promise.reject(error);
    }
  }

  async updateIncome(income: Income): Promise<void> {
    try {
      await this.ensureInitialized();
      incomeQueries.update(this.db, income);
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un revenu:", error);
      return Promise.reject(error);
    }
  }

  async deleteIncome(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return Promise.resolve();
      }
      incomeQueries.delete(this.db, id);
      return Promise.resolve();
    } catch (error) {
      console.error(`Erreur lors de la suppression du revenu avec l'ID ${id}:`, error);
      return Promise.reject(error);
    }
  }
}
