
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseInitManager } from './database-init-manager';
import { DataExportManager } from './data-export-manager';

/**
 * Service de base de données avec transition progressive vers SQLite
 * Cette classe utilise l'adaptateur SQLite pour abstraire l'accès à la base de données
 */
class DatabaseService {
  private initManager: DatabaseInitManager;
  private exportManager: DataExportManager | null = null;

  constructor() {
    this.initManager = new DatabaseInitManager();
  }

  /**
   * Initialise la base de données avec l'adaptateur approprié
   */
  async init(): Promise<boolean> {
    const success = await this.initManager.init();
    
    if (success && this.initManager.getAdapter()) {
      this.exportManager = new DataExportManager(this.initManager.getAdapter()!);
    }
    
    return success;
  }

  /**
   * Réinitialise le compteur de tentatives d'initialisation
   */
  resetInitializationAttempts(): void {
    this.initManager.resetInitializationAttempts();
  }

  /**
   * Vérifie si la base de données est initialisée et l'initialise si nécessaire
   */
  private async ensureInitialized(): Promise<boolean> {
    return await this.initManager.ensureInitialized();
  }

  /**
   * Récupère tous les revenus
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
        date: row.date
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus:", error);
      return [];
    }
  }

  /**
   * Ajoute un nouveau revenu
   */
  async addIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO incomes (id, title, budget, spent, type, date) VALUES (?, ?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type, income.date]
    );
  }

  /**
   * Met à jour un revenu existant
   */
  async updateIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.id]
    );
  }

  /**
   * Supprime un revenu
   */
  async deleteIncome(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM incomes WHERE id = ?', [id]);
  }

  /**
   * Récupère toutes les dépenses
   */
  async getExpenses(): Promise<Expense[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM expenses");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'expense' as const,
        linkedBudgetId: row.linkedBudgetId,
        date: row.date
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  }

  /**
   * Ajoute une nouvelle dépense
   */
  async addExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
    );
  }

  /**
   * Met à jour une dépense existante
   */
  async updateExpense(expense: Expense): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.id]
    );
  }

  /**
   * Supprime une dépense
   */
  async deleteExpense(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  /**
   * Récupère tous les budgets
   */
  async getBudgets(): Promise<Budget[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM budgets");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        budget: Number(row.budget),
        spent: Number(row.spent),
        type: 'budget' as const,
        carriedOver: Number(row.carriedOver || 0)
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets:", error);
      return [];
    }
  }

  /**
   * Ajoute un nouveau budget
   */
  async addBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'INSERT INTO budgets (id, title, budget, spent, type, carriedOver) VALUES (?, ?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0]
    );
  }

  /**
   * Met à jour un budget existant
   */
  async updateBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, budget.id]
    );
  }

  /**
   * Supprime un budget
   */
  async deleteBudget(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM budgets WHERE id = ?', [id]);
  }

  /**
   * Récupère toutes les catégories
   */
  async getCategories(): Promise<Category[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      const results = await adapter!.query("SELECT * FROM categories");
      
      return results.map(row => {
        let budgets;
        try {
          budgets = row.budgets && typeof row.budgets === 'string' 
            ? JSON.parse(row.budgets) 
            : [];
        } catch (e) {
          console.error(`Erreur de parsing des budgets pour la catégorie ${row.id}:`, e);
          budgets = [];
        }
        
        return {
          id: row.id,
          name: row.name,
          budgets: Array.isArray(budgets) ? budgets : [],
          total: Number(row.total) || 0,
          spent: Number(row.spent) || 0,
          description: row.description || ''
        };
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return [];
    }
  }

  /**
   * Ajoute une nouvelle catégorie
   */
  async addCategory(category: Category): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await adapter!.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, budgetsJson, category.total, category.spent, category.description]
    );
  }

  /**
   * Met à jour une catégorie existante
   */
  async updateCategory(category: Category): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await adapter!.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [category.name, budgetsJson, category.total, category.spent, category.description, category.id]
    );
  }

  /**
   * Supprime une catégorie
   */
  async deleteCategory(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM categories WHERE id = ?', [id]);
  }

  /**
   * Exporte les données de la base de données
   */
  exportData(): Uint8Array | null {
    if (this.exportManager) {
      return this.exportManager.exportData();
    }
    return null;
  }

  /**
   * Importe des données dans la base de données
   */
  importData(data: Uint8Array): boolean {
    if (this.exportManager) {
      return this.exportManager.importData(data);
    }
    return false;
  }
}

// Exporter une instance du service de base de données
export const databaseService = new DatabaseService();
