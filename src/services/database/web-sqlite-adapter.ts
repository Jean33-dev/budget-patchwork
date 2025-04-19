import { SQLiteAdapter } from './sqlite-adapter';
import { SqlJsInitializer } from './sql-js-initializer';
import { WebSQLiteOperations } from './web-sqlite-operations';
import { toast } from "@/hooks/use-toast";

/**
 * Web SQLite adapter using SQL.js
 */
export class WebSQLiteAdapter extends SQLiteAdapter {
  private db: any = null;
  private static initAttempts = 0;
  private static MAX_INIT_ATTEMPTS = 3;
  private initPromise: Promise<boolean> | null = null;
  private initStartTime: number | null = null;
  private MAX_INIT_TIME_MS = 8000; // 8 seconds timeout
  private initTimeout: number | null = null;

  constructor() {
    super();
    this.initialized = false;
  }

  /**
   * Initialize SQL.js and create an in-memory database
   */
  async init(): Promise<boolean> {
    try {
      // Clear any existing timeout to prevent memory leaks
      if (this.initTimeout !== null) {
        window.clearTimeout(this.initTimeout);
        this.initTimeout = null;
      }

      if (this.initialized && this.db) {
        console.log("WebSQLiteAdapter already initialized, reusing instance");
        return true;
      }

      // If initialization is already in progress, check for timeout
      if (this.initPromise) {
        console.log("WebSQLiteAdapter initialization already in progress, checking timeout...");
        
        // Check if initialization has been running too long
        if (this.initStartTime && Date.now() - this.initStartTime > this.MAX_INIT_TIME_MS) {
          console.warn(`WebSQLiteAdapter: Initialization has been running for more than ${this.MAX_INIT_TIME_MS}ms, resetting state`);
          this.initPromise = null;
          this.initStartTime = null;
          WebSQLiteAdapter.initAttempts = 0; // Reset attempts on timeout
        } else {
          console.log("WebSQLiteAdapter: Joining existing initialization promise");
          return this.initPromise;
        }
      }
      
      // Track initialization attempts
      WebSQLiteAdapter.initAttempts++;
      console.log(`WebSQLiteAdapter initialization attempt ${WebSQLiteAdapter.initAttempts}/${WebSQLiteAdapter.MAX_INIT_ATTEMPTS}`);
      
      if (WebSQLiteAdapter.initAttempts > WebSQLiteAdapter.MAX_INIT_ATTEMPTS) {
        console.error(`Exceeded maximum WebSQLiteAdapter initialization attempts (${WebSQLiteAdapter.MAX_INIT_ATTEMPTS})`);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Trop de tentatives d'initialisation de la base de données. Veuillez rafraîchir la page."
        });
        return false;
      }
      
      // Set initialization start time
      this.initStartTime = Date.now();
      
      // Create an initialization promise with timeout
      this.initPromise = (async () => {
        try {
          // Add delay for retries with exponential backoff
          if (WebSQLiteAdapter.initAttempts > 1) {
            const delay = Math.min(1000 * Math.pow(2, WebSQLiteAdapter.initAttempts - 1), 10000);
            console.log(`Waiting ${delay}ms before WebSQLiteAdapter retry attempt ${WebSQLiteAdapter.initAttempts}...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          // Set a global timeout for the entire initialization process
          const timeoutPromise = new Promise<boolean>((_, reject) => {
            this.initTimeout = window.setTimeout(() => {
              reject(new Error(`WebSQLiteAdapter initialization timed out after ${this.MAX_INIT_TIME_MS}ms`));
            }, this.MAX_INIT_TIME_MS);
          });
          
          // Initialize SQL.js with timeout
          console.log("WebSQLiteAdapter: initializing SQL.js...");
          const initResult = await Promise.race([
            SqlJsInitializer.initialize(),
            timeoutPromise
          ]);
          
          // Clear timeout if initialization completes
          if (this.initTimeout !== null) {
            window.clearTimeout(this.initTimeout);
            this.initTimeout = null;
          }
          
          const SQL = initResult as any;
          
          if (!SQL) {
            console.error("WebSQLiteAdapter: SQL.js initialization failed");
            return false;
          }
          
          console.log("WebSQLiteAdapter: creating new SQL.js database instance...");
          this.db = new SQL.Database();
          
          if (!this.db) {
            console.error("WebSQLiteAdapter: Failed to create database instance");
            return false;
          }
          
          this.initialized = true;
          console.log("WebSQLiteAdapter: initialized successfully");
          
          return true;
        } catch (error) {
          console.error("Error initializing WebSQLiteAdapter:", error);
          this.logError("initialization", error);
          this.initialized = false;
          this.db = null;
          
          toast({
            variant: "destructive",
            title: "Erreur d'initialisation",
            description: `Impossible d'initialiser la base de données: ${error instanceof Error ? error.message : "Erreur inconnue"}`
          });
          
          return false;
        } finally {
          // Clear the promise and start time so future initialization attempts can create a new one
          this.initPromise = null;
          this.initStartTime = null;
          
          // Clear any remaining timeout
          if (this.initTimeout !== null) {
            window.clearTimeout(this.initTimeout);
            this.initTimeout = null;
          }
        }
      })();
      
      return await this.initPromise;
    } catch (error) {
      console.error("Error in WebSQLiteAdapter.init wrapper:", error);
      this.initPromise = null;
      this.initStartTime = null;
      
      // Clear any timeout on error
      if (this.initTimeout !== null) {
        window.clearTimeout(this.initTimeout);
        this.initTimeout = null;
      }
      
      return false;
    }
  }

  /**
   * Execute a SQLite query
   */
  async execute(query: string, params: any[] = []): Promise<any> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Failed to initialize database before executing query");
    }
    return WebSQLiteOperations.execute(this.db, query, params);
  }

  /**
   * Execute a set of SQLite queries
   */
  async executeSet(queries: string[]): Promise<any> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Failed to initialize database before executing query set");
    }
    return WebSQLiteOperations.executeSet(this.db, queries);
  }

  /**
   * Execute a SQLite query without result (INSERT, UPDATE, DELETE)
   */
  async run(query: string, params: any[] = []): Promise<any> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Failed to initialize database before running query");
    }
    return WebSQLiteOperations.run(this.db, query, params);
  }

  /**
   * Execute a SQLite query and return the results (SELECT)
   */
  async query(query: string, params: any[] = []): Promise<any[]> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Failed to initialize database before querying");
    }
    return WebSQLiteOperations.query(this.db, query, params);
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }

  /**
   * Check if the database is initialized
   */
  isInitialized(): boolean {
    return this.initialized && this.db !== null;
  }

  /**
   * Export database data (for saving)
   */
  exportData(): Uint8Array | null {
    if (this.db) {
      return this.db.export();
    }
    return null;
  }

  /**
   * Import data into the database
   */
  importData(data: Uint8Array): boolean {
    try {
      const SQL = SqlJsInitializer.getSQL();
      if (!SQL) {
        return false;
      }
      
      if (this.db) {
        this.db.close();
      }
      
      this.db = WebSQLiteOperations.importData(SQL, data);
      this.initialized = !!this.db;
      return this.initialized;
    } catch (error) {
      this.logError("importData", error);
      return false;
    }
  }

  /**
   * Reset initialization attempts
   */
  static resetInitializationAttempts(): void {
    WebSQLiteAdapter.initAttempts = 0;
    SqlJsInitializer.resetInitializationAttempts();
    console.log("WebSQLiteAdapter initialization attempts reset");
  }
}
