
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
    
    // Pour les opérations d'écriture, vérifier l'espace disponible
    if (this.isWriteOperation(query)) {
      // Estimer 1 KB par défaut pour une opération d'écriture
      const hasSpace = await this.checkDiskSpace(1024);
      if (!hasSpace) {
        throw new Error("Espace de stockage insuffisant pour cette opération");
      }
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
    
    // Vérifier si des opérations d'écriture sont présentes
    const hasWriteOperations = queries.some(query => this.isWriteOperation(query));
    if (hasWriteOperations) {
      // Estimer 1 KB par requête d'écriture
      const writeQueriesCount = queries.filter(query => this.isWriteOperation(query)).length;
      const estimatedSize = writeQueriesCount * 1024;
      
      const hasSpace = await this.checkDiskSpace(estimatedSize);
      if (!hasSpace) {
        throw new Error("Espace de stockage insuffisant pour cette opération");
      }
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
    
    // Les requêtes run sont généralement des opérations d'écriture
    // Estimer 1 KB par défaut pour une opération d'écriture
    const hasSpace = await this.checkDiskSpace(1024);
    if (!hasSpace) {
      throw new Error("Espace de stockage insuffisant pour cette opération");
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
  
  /**
   * Déterminer si une requête SQL est une opération d'écriture
   */
  private isWriteOperation(query: string): boolean {
    const normalizedQuery = query.trim().toUpperCase();
    return (
      normalizedQuery.startsWith('INSERT') ||
      normalizedQuery.startsWith('UPDATE') ||
      normalizedQuery.startsWith('DELETE') ||
      normalizedQuery.startsWith('CREATE') ||
      normalizedQuery.startsWith('DROP') ||
      normalizedQuery.startsWith('ALTER')
    );
  }
}
