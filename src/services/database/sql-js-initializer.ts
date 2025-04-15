
/**
 * Module responsible for initializing and managing SQL.js
 */
import { toast } from "@/components/ui/use-toast";

export class SqlJsInitializer {
  private static SQL: any = null;
  private static initPromise: Promise<any> | null = null;
  private static initializationInProgress = false;
  private static initializationAttempts = 0;
  private static MAX_INIT_ATTEMPTS = 5;

  /**
   * Get the initialized SQL object
   */
  static getSQL(): any {
    return SqlJsInitializer.SQL;
  }

  /**
   * Check if initialization is in progress
   */
  static isInitializationInProgress(): boolean {
    return SqlJsInitializer.initializationInProgress;
  }

  /**
   * Initialize SQL.js
   */
  static async initialize(): Promise<any> {
    // If already initialized, return the SQL object
    if (SqlJsInitializer.SQL) {
      console.log("SQL.js already initialized, reusing instance");
      return SqlJsInitializer.SQL;
    }

    // If initialization is already in progress, wait for it to complete
    if (SqlJsInitializer.initializationInProgress) {
      console.log("SQL.js initialization already in progress, waiting...");
      let waitCount = 0;
      const maxWait = 20; // Maximum number of wait cycles
      
      while (SqlJsInitializer.initializationInProgress && waitCount < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waitCount++;
      }
      
      // Check if SQL was successfully initialized
      if (SqlJsInitializer.SQL) {
        console.log("SQL.js initialization completed while waiting");
        return SqlJsInitializer.SQL;
      }
      
      // If we reached max wait and still not initialized, we'll try again
      if (waitCount >= maxWait) {
        console.log("Waited too long for SQL.js initialization, starting fresh");
      }
    }

    SqlJsInitializer.initializationInProgress = true;
    SqlJsInitializer.initializationAttempts++;

    try {
      console.log(`Initializing SQL.js (attempt ${SqlJsInitializer.initializationAttempts}/${SqlJsInitializer.MAX_INIT_ATTEMPTS})...`);
      
      // Abandon after too many attempts
      if (SqlJsInitializer.initializationAttempts > SqlJsInitializer.MAX_INIT_ATTEMPTS) {
        throw new Error(`Exceeded maximum initialization attempts (${SqlJsInitializer.MAX_INIT_ATTEMPTS})`);
      }
      
      // Wait with exponential backoff for retry attempts
      if (SqlJsInitializer.initializationAttempts > 1) {
        const delay = Math.min(1000 * Math.pow(2, SqlJsInitializer.initializationAttempts - 1), 10000);
        console.log(`Waiting ${delay}ms before retry attempt ${SqlJsInitializer.initializationAttempts}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Import SQL.js dynamically
      console.log("Dynamically importing SQL.js module...");
      const SqlJsModule = await import('sql.js');
      const initSqlJs = SqlJsModule.default;
      
      console.log("SQL.js module loaded successfully:", !!initSqlJs);
      
      if (typeof initSqlJs !== 'function') {
        console.error("SQL.js import failed: initSqlJs is not a function", initSqlJs);
        throw new Error("SQL.js module does not export a function");
      }
      
      console.log("Initializing SQL.js with WASM from: /assets/sql-wasm.wasm");
      
      // Use the correct path to WASM file
      const wasmSource = '/assets/sql-wasm.wasm';
      
      SqlJsInitializer.SQL = await initSqlJs({
        locateFile: () => wasmSource
      });
      
      console.log(`SQL.js initialized successfully with WASM from: ${wasmSource}`);
      return SqlJsInitializer.SQL;
    } catch (error) {
      console.error("Failed to initialize SQL.js:", error);
      SqlJsInitializer.SQL = null;
      throw error;
    } finally {
      SqlJsInitializer.initializationInProgress = false;
    }
  }

  /**
   * Reset initialization attempts
   */
  static resetInitializationAttempts(): void {
    SqlJsInitializer.initializationAttempts = 0;
    SqlJsInitializer.initializationInProgress = false;
  }

  /**
   * Log error with toast notification
   */
  static logError(operation: string, error: any): void {
    console.error(`SQL.js error during ${operation}:`, error);
    toast({
      variant: "destructive",
      title: "Erreur de base de données",
      description: `Une erreur est survenue: ${error.message || "Erreur inconnue"}`
    });
  }
}
