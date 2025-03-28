import { SQLiteAdapter } from './sqlite-adapter';

/**
 * Web SQLite adapter using SQL.js
 */
export class WebSQLiteAdapter extends SQLiteAdapter {
  private db: any = null;
  private static SQL: any = null;
  private static initPromise: Promise<any> | null = null;
  private static initializationInProgress = false;
  private static initializationAttempts = 0;
  private static MAX_INIT_ATTEMPTS = 5;

  constructor() {
    super();
    this.initialized = false;
  }

  /**
   * Initialize SQL.js and create an in-memory database
   */
  async init(): Promise<boolean> {
    try {
      if (this.initialized && this.db) {
        return true;
      }

      // If initialization is already in progress, wait for it to complete
      if (WebSQLiteAdapter.initializationInProgress) {
        console.log("SQL.js initialization already in progress, waiting...");
        while (WebSQLiteAdapter.initializationInProgress) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Check if SQL was successfully initialized
        if (WebSQLiteAdapter.SQL && !this.db) {
          this.db = new WebSQLiteAdapter.SQL.Database();
          this.initialized = true;
        }
        
        return this.initialized;
      }

      WebSQLiteAdapter.initializationInProgress = true;
      WebSQLiteAdapter.initializationAttempts++;

      try {
        if (!WebSQLiteAdapter.SQL) {
          console.log(`Initializing SQL.js in WebSQLiteAdapter (attempt ${WebSQLiteAdapter.initializationAttempts}/${WebSQLiteAdapter.MAX_INIT_ATTEMPTS})...`);
          
          // Abandon after too many attempts
          if (WebSQLiteAdapter.initializationAttempts > WebSQLiteAdapter.MAX_INIT_ATTEMPTS) {
            throw new Error(`Exceeded maximum initialization attempts (${WebSQLiteAdapter.MAX_INIT_ATTEMPTS})`);
          }
          
          // Wait with exponential backoff for retry attempts
          if (WebSQLiteAdapter.initializationAttempts > 1) {
            const delay = Math.min(1000 * Math.pow(2, WebSQLiteAdapter.initializationAttempts - 1), 10000);
            console.log(`Waiting ${delay}ms before retry attempt ${WebSQLiteAdapter.initializationAttempts}...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          try {
            // Import SQL.js dynamically
            console.log("Dynamically importing SQL.js module...");
            const SqlJsModule = await import('sql.js');
            const initSqlJs = SqlJsModule.default;
            
            if (typeof initSqlJs !== 'function') {
              console.error("SQL.js import failed: initSqlJs is not a function", initSqlJs);
              throw new Error("SQL.js module does not export a function");
            }
            
            console.log("Trying to initialize SQL.js...");
            
            // Use the correct path to WASM file - critical for proper loading
            const wasmSource = '/assets/sql-wasm.wasm';
            
            try {
              console.log(`Loading WASM from: ${wasmSource}`);
              WebSQLiteAdapter.SQL = await initSqlJs({
                locateFile: () => wasmSource
              });
              console.log("SQL.js initialized successfully");
            } catch (error) {
              console.error(`Failed to initialize SQL.js:`, error);
              throw error;
            }
          } catch (importError) {
            console.error("Failed to import SQL.js module:", importError);
            throw new Error(`SQL.js import error: ${importError.message}`);
          }
        }

        if (WebSQLiteAdapter.SQL) {
          console.log("Creating new SQL.js database instance...");
          this.db = new WebSQLiteAdapter.SQL.Database();
          this.initialized = true;
          WebSQLiteAdapter.initializationAttempts = 0;
          console.log("SQL.js database created successfully!");
          return true;
        } else {
          throw new Error("Failed to initialize SQL.js module");
        }
      } catch (error) {
        console.error("Error initializing SQL.js:", error);
        this.logError("initialization", error);
        
        // If this is not the last attempt, allow reinitializing
        if (WebSQLiteAdapter.initializationAttempts < WebSQLiteAdapter.MAX_INIT_ATTEMPTS) {
          WebSQLiteAdapter.initializationInProgress = false;
          return false;
        } else {
          // Last attempt failed
          this.initialized = false;
          this.db = null;
          throw error;
        }
      } finally {
        WebSQLiteAdapter.initializationInProgress = false;
      }
    } catch (error) {
      console.error("Fatal error initializing SQL.js:", error);
      this.logError("initialization", error);
      this.initialized = false;
      this.db = null;
      return false;
    }
  }

  /**
   * Execute a SQLite query
   */
  async execute(query: string, params: any[] = []): Promise<any> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before executing query");
      }
      return this.db.exec(query, params);
    } catch (error) {
      this.logError("execute", error);
      throw error;
    }
  }

  /**
   * Execute a set of SQLite queries
   */
  async executeSet(queries: string[]): Promise<any> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before executing query set");
      }
      
      for (const query of queries) {
        this.db.exec(query);
      }
      return true;
    } catch (error) {
      this.logError("executeSet", error);
      throw error;
    }
  }

  /**
   * Execute a SQLite query without result (INSERT, UPDATE, DELETE)
   */
  async run(query: string, params: any[] = []): Promise<any> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before running query");
      }
      
      const stmt = this.db.prepare(query);
      const result = stmt.run(params);
      stmt.free();
      return result;
    } catch (error) {
      this.logError("run", error);
      throw error;
    }
  }

  /**
   * Execute a SQLite query and return the results (SELECT)
   */
  async query(query: string, params: any[] = []): Promise<any[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before querying");
      }
      
      const stmt = this.db.prepare(query);
      const results: any[] = [];
      
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      
      stmt.free();
      return results;
    } catch (error) {
      this.logError("query", error);
      throw error;
    }
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
      if (!WebSQLiteAdapter.SQL) {
        return false;
      }
      
      if (this.db) {
        this.db.close();
      }
      
      this.db = new WebSQLiteAdapter.SQL.Database(data);
      this.initialized = true;
      return true;
    } catch (error) {
      this.logError("importData", error);
      return false;
    }
  }

  /**
   * Reset initialization attempts
   */
  static resetInitializationAttempts(): void {
    WebSQLiteAdapter.initializationAttempts = 0;
  }
}
