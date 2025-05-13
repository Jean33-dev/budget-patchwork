
import { SQLiteAdapter } from './sqlite-adapter';
import { SqlJsInitializer } from './sql-js-initializer';
import { WebSQLiteOperations } from './web-sqlite-operations';

/**
 * Web SQLite adapter using SQL.js
 */
export class WebSQLiteAdapter extends SQLiteAdapter {
  private db: any = null;

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

      // Reset initialization attempts if needed
      SqlJsInitializer.resetInitializationAttempts();
      
      // Initialize SQL.js
      const SQL = await SqlJsInitializer.initialize();
      
      if (SQL) {
        console.log("Creating new SQL.js database instance...");
        this.db = new SQL.Database();
        this.initialized = true;
        console.log("SQL.js database created successfully!");
        return true;
      } else {
        throw new Error("Failed to initialize SQL.js module");
      }
    } catch (error) {
      console.error("Error initializing SQL.js:", error);
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
    SqlJsInitializer.resetInitializationAttempts();
  }
}
