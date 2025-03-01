
import { BaseDatabaseManager } from './base-database-manager';
import { Budget } from './models/budget';
import { budgetQueries } from './queries/budget-queries';

export class BudgetManager extends BaseDatabaseManager {
  async getBudgets(): Promise<Budget[]> {
    await this.ensureInitialized();
    return budgetQueries.getAll(this.db);
  }

  async addBudget(budget: Budget) {
    await this.ensureInitialized();
    
    try {
      console.log("Ajout d'un nouveau budget:", budget);
      budgetQueries.add(this.db, budget);
      console.log("Budget ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    await this.ensureInitialized();
    budgetQueries.update(this.db, budget);
  }

  async deleteBudget(id: string) {
    await this.ensureInitialized();
    budgetQueries.delete(this.db, id);
  }
}
