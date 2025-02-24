
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

// Types pour nos tables
export interface Income {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income";
  date: string;
  periodId: string; // ID de la période budgétaire
}

export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "expense";
  linkedBudgetId?: string;
  date: string;
  periodId: string; // ID de la période budgétaire
}

export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
  carriedOver?: number;
}

export interface BudgetPeriod {
  id: string;
  startDate: string;
  endDate: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  budgets: string[];
  total: number;
  spent: number;
  description: string;
}

class Database {
  private db: any = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.initialized) return;
    
    // Si une initialisation est déjà en cours, attendez-la
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        console.log("Initialisation de SQL.js...");
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });
        
        console.log("Création de la base de données...");
        this.db = new SQL.Database();
        
        // Création des tables
        console.log("Création des tables...");
        
        // D'abord, créer la table des périodes budgétaires
        this.db.run(`
          CREATE TABLE IF NOT EXISTS budget_periods (
            id TEXT PRIMARY KEY,
            startDate TEXT NOT NULL,
            endDate TEXT,
            name TEXT NOT NULL
          )
        `);

        // Créer la table des catégories
        this.db.run(`
          CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
            budgets TEXT,
            total REAL DEFAULT 0,
            spent REAL DEFAULT 0,
            description TEXT
          )
        `);

        // Créer la table des budgets
        this.db.run(`
          CREATE TABLE IF NOT EXISTS budgets (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            budget REAL NOT NULL,
            spent REAL DEFAULT 0,
            type TEXT CHECK(type IN ('budget')) NOT NULL,
            carriedOver REAL DEFAULT 0
          )
        `);

        // Vérifier si la table incomes existe déjà pour savoir si c'est une nouvelle base ou une migration
        const tableCheck = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='incomes'");
        const isNewDatabase = !tableCheck[0]?.values?.length;

        // Si c'est une nouvelle base, créer les tables avec les contraintes de clé étrangère
        if (isNewDatabase) {
          this.db.run(`
            CREATE TABLE incomes (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              budget REAL NOT NULL,
              spent REAL NOT NULL,
              type TEXT CHECK(type IN ('income')) NOT NULL,
              date TEXT NOT NULL,
              periodId TEXT NOT NULL,
              FOREIGN KEY(periodId) REFERENCES budget_periods(id)
            )
          `);

          this.db.run(`
            CREATE TABLE expenses (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              budget REAL NOT NULL,
              spent REAL NOT NULL,
              type TEXT CHECK(type IN ('expense')) NOT NULL,
              linkedBudgetId TEXT,
              date TEXT NOT NULL,
              periodId TEXT NOT NULL,
              FOREIGN KEY(linkedBudgetId) REFERENCES budgets(id),
              FOREIGN KEY(periodId) REFERENCES budget_periods(id)
            )
          `);
        } else {
          // C'est une base existante, on doit migrer les données
          // 1. Créer une période budgétaire pour les données existantes
          const defaultPeriod = {
            id: 'default-period',
            startDate: new Date(2024, 0, 1).toISOString().split('T')[0], // 1er janvier 2024
            endDate: null,
            name: 'Période initiale'
          };
          
          try {
            await this.addBudgetPeriod(defaultPeriod);
            
            // 2. Ajouter la colonne periodId aux tables existantes
            this.db.run(`
              ALTER TABLE incomes ADD COLUMN periodId TEXT REFERENCES budget_periods(id)
            `);
            this.db.run(`
              ALTER TABLE expenses ADD COLUMN periodId TEXT REFERENCES budget_periods(id)
            `);
            
            // 3. Mettre à jour les enregistrements existants avec la période par défaut
            this.db.run(`
              UPDATE incomes SET periodId = ? WHERE periodId IS NULL
            `, [defaultPeriod.id]);
            
            this.db.run(`
              UPDATE expenses SET periodId = ? WHERE periodId IS NULL
            `, [defaultPeriod.id]);
          } catch (err) {
            console.log("La migration a déjà été effectuée ou n'est pas nécessaire");
          }
        }

        console.log("Vérification de l'existence d'une période budgétaire...");
        const result = this.db.exec("SELECT COUNT(*) as count FROM budget_periods WHERE endDate IS NULL");
        const hasPeriod = result[0]?.values[0][0] > 0;

        if (!hasPeriod) {
          console.log("Création de la première période budgétaire...");
          const firstPeriod = {
            id: Date.now().toString(),
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            name: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
          };
          await this.addBudgetPeriod(firstPeriod);

          console.log("Ajout des données de test...");
          await this.addTestData(firstPeriod.id);
        }

        this.initialized = true;
        console.log("Base de données initialisée avec succès!");

      } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données:', err);
        this.initialized = false;
        this.db = null;
        throw err;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  private async addTestData(periodId: string) {
    // Ajout de revenus de test
    const testIncomes = [
      {
        id: "1",
        title: "Salaire",
        budget: 2500,
        spent: 2500,
        type: "income" as const,
        date: new Date().toISOString().split('T')[0],
        periodId
      },
      {
        id: "2",
        title: "Freelance",
        budget: 500,
        spent: 500,
        type: "income" as const,
        date: new Date().toISOString().split('T')[0],
        periodId
      }
    ];

    // Ajout de budgets de test
    const testBudgets = [
      {
        id: "1",
        title: "Loyer",
        budget: 800,
        spent: 0,
        type: "budget" as const,
        carriedOver: 0
      },
      {
        id: "2",
        title: "Courses",
        budget: 400,
        spent: 0,
        type: "budget" as const,
        carriedOver: 0
      },
      {
        id: "3",
        title: "Transport",
        budget: 150,
        spent: 0,
        type: "budget" as const,
        carriedOver: 0
      }
    ];

    // Ajout de catégories de test
    const testCategories = [
      {
        id: "1",
        title: "Nécessaire",
        type: "expense" as const,
        budgets: JSON.stringify(["1", "2"]),
        total: 1200,
        spent: 0,
        description: "Dépenses essentielles"
      },
      {
        id: "2",
        title: "Transport",
        type: "expense" as const,
        budgets: JSON.stringify(["3"]),
        total: 150,
        spent: 0,
        description: "Dépenses de transport"
      }
    ];

    // Insertion des données de test
    for (const income of testIncomes) {
      await this.addIncome(income);
    }

    for (const budget of testBudgets) {
      await this.addBudget(budget);
    }

    for (const category of testCategories) {
      this.db.run(
        'INSERT INTO categories (id, title, type, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [category.id, category.title, category.type, category.budgets, category.total, category.spent, category.description]
      );
    }
  }

  // Méthodes pour gérer les périodes budgétaires
  async getCurrentPeriod(): Promise<BudgetPeriod> {
    await this.init(); // S'assure que la base est initialisée
    const result = this.db.exec("SELECT * FROM budget_periods WHERE endDate IS NULL");
    if (!result[0]?.values) {
      throw new Error("Aucune période budgétaire active trouvée");
    }
    const row = result[0].values[0];
    return {
      id: row[0],
      startDate: row[1],
      endDate: row[2],
      name: row[3]
    };
  }

  async addBudgetPeriod(period: BudgetPeriod) {
    this.db.run(
      "INSERT INTO budget_periods (id, startDate, endDate, name) VALUES (?, ?, ?, ?)",
      [period.id, period.startDate, period.endDate, period.name]
    );
  }

  async closePeriod(periodId: string, endDate: string) {
    this.db.run(
      "UPDATE budget_periods SET endDate = ? WHERE id = ?",
      [endDate, periodId]
    );
  }

  // Méthodes pour les revenus
  async getIncomes(periodId?: string): Promise<Income[]> {
    let query = "SELECT * FROM incomes";
    let params: any[] = [];

    if (periodId) {
      query += " WHERE periodId = ?";
      params = [periodId];
    }

    const incomes: Income[] = [];
    const stmt = this.db.prepare(query);
    
    if (params.length > 0) {
      stmt.bind(params);
    }

    while (stmt.step()) {
      const row = stmt.getAsObject();
      incomes.push(row as any as Income);
    }
    stmt.free();
    return incomes;
  }

  async addIncome(income: Income) {
    if (!income.periodId) {
      const currentPeriod = await this.getCurrentPeriod();
      income.periodId = currentPeriod.id;
    }
    
    this.db.run(
      "INSERT INTO incomes (id, title, budget, spent, type, date, periodId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [income.id, income.title, income.budget, income.spent, income.type, income.date, income.periodId]
    );
  }

  async updateIncome(income: Income) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.id]
    );
  }

  async deleteIncome(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM incomes WHERE id = ?', [id]);
  }

  // Méthodes pour les dépenses
  async getExpenses(periodId?: string): Promise<Expense[]> {
    let query = "SELECT * FROM expenses";
    let params: any[] = [];

    if (periodId) {
      query += " WHERE periodId = ?";
      params = [periodId];
    }

    const expenses: Expense[] = [];
    const stmt = this.db.prepare(query);
    
    if (params.length > 0) {
      stmt.bind(params);
    }

    while (stmt.step()) {
      const row = stmt.getAsObject();
      expenses.push(row as any as Expense);
    }
    stmt.free();
    return expenses;
  }

  async addExpense(expense: Expense) {
    if (!expense.periodId) {
      const currentPeriod = await this.getCurrentPeriod();
      expense.periodId = currentPeriod.id;
    }

    this.db.run(
      "INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, periodId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date, expense.periodId]
    );
  }

  async updateExpense(expense: Expense) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?',
      [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.id]
    );
  }

  async deleteExpense(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  // Méthodes pour les budgets
  async getBudgets(): Promise<Budget[]> {
    if (!this.initialized) await this.init();
    
    const result = this.db.exec('SELECT * FROM budgets');
    return result[0]?.values?.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      budget: row[2],
      spent: row[3],
      type: row[4] as 'budget',
      carriedOver: row[5] || 0
    })) || [];
  }

  async addBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    try {
      console.log("Ajout d'un nouveau budget:", budget);
      this.db.run(
        'INSERT INTO budgets (id, title, budget, spent, type, carriedOver) VALUES (?, ?, ?, ?, ?, ?)',
        [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0]
      );
      console.log("Budget ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, budget.id]
    );
  }

  async deleteBudget(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM budgets WHERE id = ?', [id]);
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
    if (!this.initialized) await this.init();
    
    try {
      console.log("=== Début du chargement des catégories ===");
      const result = this.db.exec('SELECT * FROM categories');
      console.log("Résultat brut de la requête:", result);
      
      if (!result[0]?.values) {
        console.log("Aucune catégorie trouvée");
        return [];
      }

      const categories = result[0].values.map((row: any[]) => {
        const [id, name, budgetsStr, total, spent, description] = row;
        let budgets;
        try {
          // S'assurer que le string JSON est valide avant de le parser
          budgets = budgetsStr && typeof budgetsStr === 'string' ? JSON.parse(budgetsStr) : [];
          console.log(`Budgets parsés pour la catégorie ${id}:`, budgets);
        } catch (e) {
          console.error(`Erreur de parsing des budgets pour la catégorie ${id}:`, e);
          budgets = [];
        }

        return {
          id,
          name,
          budgets: Array.isArray(budgets) ? budgets : [],
          total: Number(total) || 0,
          spent: Number(spent) || 0,
          description: description || ''
        };
      });

      console.log("Catégories chargées avec succès:", categories);
      return categories;
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      throw error;
    }
  }

  async addCategory(category: Category) {
    if (!this.initialized) await this.init();
    
    this.db.run(
      'INSERT INTO categories (id, name, budgets, total, spent, description) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.name, JSON.stringify(category.budgets), category.total, category.spent, category.description]
    );
  }

  async updateCategory(category: Category) {
    if (!this.initialized) await this.init();
    
    try {
      console.log("=== Début de la mise à jour de la catégorie dans la base de données ===");
      console.log("Catégorie reçue:", category);
      
      // Validation des données
      if (!category || !category.id) {
        throw new Error("Catégorie invalide");
      }
      
      // S'assurer que les budgets sont un tableau
      const budgets = Array.isArray(category.budgets) ? category.budgets : [];
      const total = Number(category.total) || 0;
      const spent = Number(category.spent) || 0;
      
      // Convertir le tableau en JSON pour le stockage
      const budgetsJson = JSON.stringify(budgets);
      console.log("Budgets avant stringify:", budgets);
      console.log("Budgets après stringify:", budgetsJson);
      
      // Utiliser une transaction pour s'assurer que tout est mis à jour correctement
      this.db.run('BEGIN TRANSACTION');
      
      const stmt = this.db.prepare(
        'UPDATE categories SET name = ?, budgets = ?, total = ?, spent = ?, description = ? WHERE id = ?'
      );
      
      stmt.run(
        [category.name, budgetsJson, total, spent, category.description, category.id]
      );
      stmt.free();
      
      this.db.run('COMMIT');
      
      // Vérifier immédiatement la mise à jour
      const result = this.db.exec(
        'SELECT * FROM categories WHERE id = ?',
        [category.id]
      );
      console.log("Vérification après mise à jour:", result);
      
      // Si la catégorie n'existe pas, on la crée
      if (!result[0]) {
        console.error("La catégorie n'existe pas, tentative de création");
        await this.addCategory(category);
        return;
      }
      
      console.log("=== Mise à jour terminée avec succès ===");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      this.db.run('ROLLBACK');
      throw error;
    }
  }

  async deleteCategory(id: string) {
    if (!this.initialized) await this.init();
    this.db.run('DELETE FROM categories WHERE id = ?', [id]);
  }

  // Méthodes pour les périodes budgétaires
  async getAllPeriods(): Promise<BudgetPeriod[]> {
    await this.init(); // S'assure que la base est initialisée
    const result = this.db.exec('SELECT * FROM budget_periods ORDER BY startDate DESC');
    if (!result[0]?.values) return [];

    return result[0].values.map((row: any[]) => ({
      id: row[0],
      startDate: row[1],
      endDate: row[2],
      name: row[3]
    }));
  }

  // Sauvegarder la base de données
  exportData() {
    return this.db.export();
  }
}

export const db = new Database();
