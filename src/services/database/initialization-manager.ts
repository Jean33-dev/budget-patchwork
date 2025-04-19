
import { SQLiteAdapter } from './sqlite-adapter';
import { toast } from "@/components/ui/use-toast";

/**
 * Class responsible for initializing the database tables and sample data
 */
export class InitializationManager {
  private adapter: SQLiteAdapter;
  
  constructor(adapter: SQLiteAdapter) {
    this.adapter = adapter;
  }

  /**
   * Create all required database tables
   */
  async createTables(): Promise<void> {
    if (!this.adapter) throw new Error("Adaptateur SQLite non initialisé");
    
    const queries = [
      // Table des revenus
      `CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        date TEXT,
        isRecurring INTEGER DEFAULT 0
      )`,
      
      // Table des dépenses
      `CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        linkedBudgetId TEXT,
        date TEXT,
        isRecurring INTEGER DEFAULT 0
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
      )`,
      
      // Table des tableaux de bord
      `CREATE TABLE IF NOT EXISTS dashboards (
        id TEXT PRIMARY KEY,
        title TEXT,
        createdAt TEXT,
        lastAccessed TEXT
      )`
    ];
    
    await this.adapter.executeSet(queries);
    console.log("Tables de base de données créées avec succès");
  }

  /**
   * Check if sample data needs to be added and add it if necessary
   */
  async checkAndAddSampleData(): Promise<void> {
    if (!this.adapter) throw new Error("Adaptateur SQLite non initialisé");
    
    try {
      console.log("Vérifiant si des données d'exemple doivent être ajoutées...");
      
      // Vérifier si des budgets existent déjà
      const budgets = await this.adapter.query("SELECT COUNT(*) as count FROM budgets");
      const budgetCount = budgets.length > 0 ? (budgets[0]?.count || 0) : 0;
      
      console.log(`Nombre de budgets existants: ${budgetCount}`);
      
      if (budgetCount === 0) {
        console.log("Aucun budget trouvé, ajout de données d'exemple...");
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Ajouter des budgets d'exemple
        const budgetQueries = [
          `INSERT OR IGNORE INTO budgets (id, title, budget, spent, type, carriedOver)
          VALUES 
          ('bud_1', 'Courses', 500.00, 0.00, 'budget', 0),
          ('bud_2', 'Transport', 200.00, 0.00, 'budget', 0),
          ('bud_3', 'Loisirs', 150.00, 0.00, 'budget', 0),
          ('bud_4', 'Restaurant', 300.00, 0.00, 'budget', 0),
          ('bud_5', 'Shopping', 250.00, 0.00, 'budget', 0)`
        ];
        
        await this.adapter.executeSet(budgetQueries);
        console.log("Budgets d'exemple ajoutés");
        
        // Ajouter des dépenses d'exemple liées aux budgets
        const expenseQuery = `
          INSERT OR IGNORE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring)
          VALUES 
          ('exp_1', 'Courses Carrefour', 350.00, 350.00, 'expense', 'bud_1', ?, 0),
          ('exp_2', 'Courses Lidl', 250.00, 250.00, 'expense', 'bud_1', ?, 0),
          ('exp_3', 'Restaurant italien', 150.00, 150.00, 'expense', 'bud_4', ?, 0),
          ('exp_4', 'Vêtements', 100.00, 100.00, 'expense', 'bud_5', ?, 0),
          ('exp_5', 'Loyer', 500.00, 500.00, 'expense', NULL, ?, 1),
          ('exp_6', 'Abonnement Transport', 75.00, 75.00, 'expense', 'bud_2', ?, 1)
        `;
        
        await this.adapter.run(expenseQuery, [currentDate, currentDate, currentDate, currentDate, currentDate, currentDate]);
        console.log("Dépenses d'exemple ajoutées");
        
        // Ajouter des revenus d'exemple
        const incomeQuery = `
          INSERT OR IGNORE INTO incomes (id, title, budget, spent, type, date, isRecurring)
          VALUES 
          ('inc_1', 'Salaire', 2000.00, 2000.00, 'income', ?, 1),
          ('inc_2', 'Prime', 500.00, 500.00, 'income', ?, 0)
        `;
        
        await this.adapter.run(incomeQuery, [currentDate, currentDate]);
        console.log("Revenus d'exemple ajoutés");
        
        // Ajouter un tableau de bord par défaut
        const dashboardQuery = `
          INSERT OR IGNORE INTO dashboards (id, title, createdAt, lastAccessed)
          VALUES ('default', 'Budget Personnel', ?, ?)
        `;
        
        const now = new Date().toISOString();
        await this.adapter.run(dashboardQuery, [now, now]);
        console.log("Tableau de bord par défaut ajouté");
        
        console.log("Données d'exemple ajoutées avec succès");
      } else {
        console.log(`${budgetCount} budgets trouvés, pas besoin d'ajouter des données d'exemple`);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification ou de l'ajout de données d'exemple:", error);
      // Continue même en cas d'erreur avec les données d'exemple
    }
  }
}
