
import { createSQLiteAdapter, SQLiteAdapter } from './sqlite-adapter';
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { toast } from "@/components/ui/use-toast";

/**
 * Service de base de données avec transition progressive vers SQLite
 * Cette classe utilise l'adaptateur SQLite pour abstraire l'accès à la base de données
 */
class DatabaseService {
  private adapter: SQLiteAdapter | null = null;
  private initialized = false;
  private initializing = false;
  private initAttempts = 0;
  private readonly MAX_INIT_ATTEMPTS = 3;

  constructor() {
    this.initialized = false;
  }

  /**
   * Initialise la base de données avec l'adaptateur approprié
   */
  async init(): Promise<boolean> {
    // Si déjà initialisé, retourne true
    if (this.initialized && this.adapter) {
      console.log("Base de données déjà initialisée");
      return true;
    }
    
    // Si l'initialisation est en cours, attendez
    if (this.initializing) {
      console.log("Initialisation de la base de données en cours...");
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.initialized;
    }
    
    this.initializing = true;
    this.initAttempts++;
    
    try {
      console.log(`Tentative d'initialisation de la base de données (${this.initAttempts}/${this.MAX_INIT_ATTEMPTS})...`);
      
      // Créer l'adaptateur SQLite approprié selon l'environnement
      this.adapter = await createSQLiteAdapter();
      
      // Initialiser l'adaptateur
      const adapterInitialized = await this.adapter.init();
      if (!adapterInitialized) {
        throw new Error("Échec de l'initialisation de l'adaptateur SQLite");
      }
      
      // Créer les tables de la base de données
      await this.createTables();
      
      // Vérifier si des données existent et ajouter des données d'exemple si nécessaire
      await this.checkAndAddSampleData();
      
      this.initialized = true;
      console.log("Base de données initialisée avec succès");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la base de données:", error);
      
      // Si on n'a pas dépassé le nombre max de tentatives, on peut réessayer automatiquement
      if (this.initAttempts < this.MAX_INIT_ATTEMPTS) {
        this.initializing = false;
        console.log(`Nouvelle tentative d'initialisation (${this.initAttempts + 1}/${this.MAX_INIT_ATTEMPTS})...`);
        // On laisse le code appelant décider s'il faut réessayer
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser la base de données après plusieurs tentatives."
        });
        this.initialized = false;
        this.adapter = null;
      }
      
      return false;
    } finally {
      this.initializing = false;
    }
  }

  /**
   * Réinitialise le compteur de tentatives d'initialisation
   */
  resetInitializationAttempts(): void {
    this.initAttempts = 0;
  }

  /**
   * Crée les tables de la base de données si elles n'existent pas
   */
  private async createTables(): Promise<void> {
    if (!this.adapter) throw new Error("Adaptateur SQLite non initialisé");
    
    const queries = [
      // Table des revenus
      `CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        date TEXT
      )`,
      
      // Table des dépenses
      `CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        linkedBudgetId TEXT,
        date TEXT
      )`,
      
      // Table des budgets
      `CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        carriedOver REAL DEFAULT 0
      )`,
      
      // Table des catégories
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT,
        budgets TEXT,
        total REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        description TEXT
      )`
    ];
    
    await this.adapter.executeSet(queries);
  }

  /**
   * Vérifie si des données existent déjà et ajoute des données d'exemple si nécessaire
   */
  private async checkAndAddSampleData(): Promise<void> {
    if (!this.adapter) throw new Error("Adaptateur SQLite non initialisé");
    
    try {
      // Vérifier si des budgets existent déjà
      const budgets = await this.adapter.query("SELECT COUNT(*) as count FROM budgets");
      const budgetCount = budgets[0]?.count || 0;
      
      if (budgetCount === 0) {
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Ajouter des budgets d'exemple
        const budgetQueries = [
          `INSERT OR IGNORE INTO budgets (id, title, budget, spent, type, carriedOver)
          VALUES 
          ('bud_1', 'Courses', 500.00, 600.00, 'budget', 0),
          ('bud_2', 'Transport', 200.00, 0.00, 'budget', 0),
          ('bud_3', 'Loisirs', 150.00, 0.00, 'budget', 0),
          ('bud_4', 'Restaurant', 300.00, 150.00, 'budget', 0),
          ('bud_5', 'Shopping', 250.00, 100.00, 'budget', 0)`
        ];
        
        await this.adapter.executeSet(budgetQueries);
        
        // Ajouter des dépenses d'exemple liées aux budgets
        await this.adapter.run(
          `INSERT OR IGNORE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date)
          VALUES 
          ('exp_1', 'Courses Carrefour', 350.00, 0, 'expense', 'bud_1', ?),
          ('exp_2', 'Courses Lidl', 250.00, 0, 'expense', 'bud_1', ?),
          ('exp_3', 'Restaurant italien', 150.00, 0, 'expense', 'bud_4', ?),
          ('exp_4', 'Vêtements', 100.00, 0, 'expense', 'bud_5', ?)`,
          [currentDate, currentDate, currentDate, currentDate]
        );
        
        console.log("Données d'exemple ajoutées avec succès");
      } else {
        console.log(`${budgetCount} budgets trouvés, pas besoin d'ajouter des données d'exemple`);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification ou de l'ajout de données d'exemple:", error);
      // Continue même en cas d'erreur avec les données d'exemple
    }
  }

  /**
   * Vérifie si la base de données est initialisée et l'initialise si nécessaire
   */
  private async ensureInitialized(): Promise<boolean> {
    if (!this.initialized || !this.adapter) {
      return await this.init();
    }
    return true;
  }

  /**
   * Récupère tous les revenus
   */
  async getIncomes(): Promise<Income[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const results = await this.adapter!.query("SELECT * FROM incomes");
      
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
    
    await this.adapter!.run(
      'INSERT INTO incomes (id, title, budget, spent, type, date) VALUES (?, ?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type, income.date]
    );
  }

  /**
   * Met à jour un revenu existant
   */
  async updateIncome(income: Income): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    await this.adapter!.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.id]
    );
  }

  /**
   * Supprime un revenu
   */
  async deleteIncome(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    await this.adapter!.run('DELETE FROM incomes WHERE id = ?', [id]);
  }

  /**
   * Récupère toutes les dépenses
   */
  async getExpenses(): Promise<Expense[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const results = await this.adapter!.query("SELECT * FROM expenses");
      
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
    
    await this.adapter!.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
    );
  }

  /**
   * Supprime une dépense
   */
  async deleteExpense(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    await this.adapter!.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  /**
   * Récupère tous les budgets
   */
  async getBudgets(): Promise<Budget[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const results = await this.adapter!.query("SELECT * FROM budgets");
      
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
    
    await this.adapter!.run(
      'INSERT INTO budgets (id, title, budget, spent, type, carriedOver) VALUES (?, ?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0]
    );
  }

  /**
   * Met à jour un budget existant
   */
  async updateBudget(budget: Budget): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    await this.adapter!.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, budget.id]
    );
  }

  /**
   * Supprime un budget
   */
  async deleteBudget(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    await this.adapter!.run('DELETE FROM budgets WHERE id = ?', [id]);
  }

  /**
   * Récupère toutes les catégories
   */
  async getCategories(): Promise<Category[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const results = await this.adapter!.query("SELECT * FROM categories");
      
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
    
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await this.adapter!.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, budgetsJson, category.total, category.spent, category.description]
    );
  }

  /**
   * Met à jour une catégorie existante
   */
  async updateCategory(category: Category): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const budgetsJson = JSON.stringify(category.budgets || []);
    
    await this.adapter!.run(
      'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?',
      [category.name, budgetsJson, category.total, category.spent, category.description, category.id]
    );
  }

  /**
   * Supprime une catégorie
   */
  async deleteCategory(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    await this.adapter!.run('DELETE FROM categories WHERE id = ?', [id]);
  }

  /**
   * Exporte les données de la base de données
   */
  exportData(): Uint8Array | null {
    if (this.adapter && 'exportData' in this.adapter) {
      return (this.adapter as any).exportData();
    }
    return null;
  }

  /**
   * Importe des données dans la base de données
   */
  importData(data: Uint8Array): boolean {
    if (this.adapter && 'importData' in this.adapter) {
      return (this.adapter as any).importData(data);
    }
    return false;
  }
}

// Exporter une instance du service de base de données
export const databaseService = new DatabaseService();
