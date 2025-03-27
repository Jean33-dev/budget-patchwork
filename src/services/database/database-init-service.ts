
import { SQLiteAdapter, createSQLiteAdapter } from './sqlite-adapter';
import { toast } from "@/components/ui/use-toast";

/**
 * Handles database initialization and setup
 */
export class DatabaseInitService {
  private adapter: SQLiteAdapter | null = null;
  private initialized = false;
  private initializing = false;
  private initAttempts = 0;
  private readonly MAX_INIT_ATTEMPTS = 3;

  /**
   * Initializes the database with the appropriate adapter
   */
  async init(): Promise<boolean> {
    // If already initialized, return true
    if (this.initialized && this.adapter) {
      console.log("Database already initialized");
      return true;
    }
    
    // If initialization is in progress, wait
    if (this.initializing) {
      console.log("Database initialization in progress...");
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.initialized;
    }
    
    this.initializing = true;
    this.initAttempts++;
    
    try {
      console.log(`Database initialization attempt (${this.initAttempts}/${this.MAX_INIT_ATTEMPTS})...`);
      
      // Create the appropriate SQLite adapter for the environment
      this.adapter = await createSQLiteAdapter();
      
      // Initialize the adapter
      const adapterInitialized = await this.adapter.init();
      if (!adapterInitialized) {
        throw new Error("Failed to initialize SQLite adapter");
      }
      
      // Create database tables
      await this.createTables();
      
      // Check and add sample data if needed
      await this.checkAndAddSampleData();
      
      this.initialized = true;
      console.log("Database initialized successfully");
      
      return true;
    } catch (error) {
      console.error("Error initializing database:", error);
      
      if (this.initAttempts < this.MAX_INIT_ATTEMPTS) {
        this.initializing = false;
        console.log(`Will retry initialization (${this.initAttempts + 1}/${this.MAX_INIT_ATTEMPTS})...`);
      } else {
        toast({
          variant: "destructive",
          title: "Initialization error",
          description: "Unable to initialize database after multiple attempts."
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
   * Creates the database tables if they don't exist
   */
  private async createTables(): Promise<void> {
    if (!this.adapter) throw new Error("SQLite adapter not initialized");
    
    const queries = [
      // Table for incomes
      `CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        date TEXT
      )`,
      
      // Table for expenses
      `CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        linkedBudgetId TEXT,
        date TEXT
      )`,
      
      // Table for budgets
      `CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        title TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        type TEXT,
        carriedOver REAL DEFAULT 0
      )`,
      
      // Table for categories
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
   * Checks if data exists and adds sample data if needed
   */
  private async checkAndAddSampleData(): Promise<void> {
    if (!this.adapter) throw new Error("SQLite adapter not initialized");
    
    try {
      // Check if budgets exist
      const budgets = await this.adapter.query("SELECT COUNT(*) as count FROM budgets");
      const budgetCount = budgets[0]?.count || 0;
      
      if (budgetCount === 0) {
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Add sample budgets
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
        
        // Add sample expenses linked to budgets
        await this.adapter.run(
          `INSERT OR IGNORE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date)
          VALUES 
          ('exp_1', 'Courses Carrefour', 350.00, 0, 'expense', 'bud_1', ?),
          ('exp_2', 'Courses Lidl', 250.00, 0, 'expense', 'bud_1', ?),
          ('exp_3', 'Restaurant italien', 150.00, 0, 'expense', 'bud_4', ?),
          ('exp_4', 'Vêtements', 100.00, 0, 'expense', 'bud_5', ?)`,
          [currentDate, currentDate, currentDate, currentDate]
        );
        
        console.log("Sample data added successfully");
      } else {
        console.log(`${budgetCount} budgets found, no need to add sample data`);
      }
    } catch (error) {
      console.error("Error checking or adding sample data:", error);
      // Continue even if there's an error with sample data
    }
  }

  /**
   * Resets the initialization attempts counter
   */
  resetInitializationAttempts(): void {
    this.initAttempts = 0;
  }

  /**
   * Gets the database adapter
   */
  getAdapter(): SQLiteAdapter | null {
    return this.adapter;
  }

  /**
   * Checks if the database is initialized
   */
  isInitialized(): boolean {
    return this.initialized && !!this.adapter;
  }
}
