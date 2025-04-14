
import { Database } from 'sql.js';

/**
 * Abstract class for SQLite adapter
 */
export abstract class SQLiteAdapter {
  protected initialized = false;

  /**
   * Initialize the database
   */
  abstract init(): Promise<boolean>;

  /**
   * Execute a SQLite query
   */
  abstract execute(query: string, params?: any[]): Promise<any>;

  /**
   * Execute a set of SQLite queries
   */
  abstract executeSet(queries: string[]): Promise<any>;

  /**
   * Execute a SQLite query without result (INSERT, UPDATE, DELETE)
   */
  abstract run(query: string, params?: any[]): Promise<any>;

  /**
   * Execute a SQLite query and return the results (SELECT)
   */
  abstract query(query: string, params?: any[]): Promise<any[]>;

  /**
   * Close the database connection
   */
  abstract close(): Promise<void>;

  /**
   * Check if the database is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Ensure the adapter is initialized
   */
  async ensureInitialized(): Promise<boolean> {
    if (!this.initialized) {
      return await this.init();
    }
    return true;
  }

  /**
   * Log error
   */
  protected logError(operation: string, error: any): void {
    console.error(`SQLite error during ${operation}:`, error);
  }
}

/**
 * Factory for SQLite adapter
 */
export async function createSQLiteAdapter(): Promise<SQLiteAdapter> {
  console.log("Creating SQLite adapter...");
  try {
    // Import dynamically for better compatibility with modules
    const { WebSQLiteAdapter } = await import('./web-sqlite-adapter');
    console.log("WebSQLiteAdapter imported successfully");
    const adapter = new WebSQLiteAdapter();
    return adapter;
  } catch (error) {
    console.error("Error creating SQLite adapter:", error);
    throw error;
  }
}
