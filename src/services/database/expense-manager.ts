
import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return expenseQueries.getAll(this.db);
  }

  async addExpense(expense: Expense) {
    await this.ensureInitialized();
    expenseQueries.add(this.db, expense);
  }

  async updateExpense(expense: Expense) {
    await this.ensureInitialized();
    expenseQueries.update(this.db, expense);
  }

  async deleteExpense(id: string): Promise<boolean> {
    try {
      console.time('deleteExpense');
      await this.ensureInitialized();
      
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return false;
      }
      
      // Utiliser la méthode de masquage au lieu de la suppression
      const hideStatus = expenseQueries.hideExpense(this.db, id);
      console.log(`Résultat du masquage pour ID ${id}:`, hideStatus);
      console.timeEnd('deleteExpense');
      return hideStatus;
    } catch (error) {
      console.error(`Erreur dans ExpenseManager.deleteExpense pour l'ID ${id}:`, error);
      console.timeEnd('deleteExpense');
      return false;
    }
  }
  
  // Ajouter une méthode pour la suppression réelle si nécessaire
  async permanentlyDeleteExpense(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      if (!id) {
        return false;
      }
      
      return expenseQueries.delete(this.db, id);
    } catch (error) {
      console.error(`Erreur lors de la suppression permanente:`, error);
      return false;
    }
  }
}
