
/**
 * SQLite.js initializer
 */
export class SqlJsInitializer {
  private static SQL: any = null;
  private static isInitializing = false;
  private static initPromise: Promise<any> | null = null;
  private static initAttempts = 0;
  private static MAX_INIT_ATTEMPTS = 5;

  /**
   * Initialize SQLite.js
   */
  static async initialize(): Promise<any> {
    // If already initialized, return SQL
    if (SqlJsInitializer.SQL) {
      console.log("SqlJsInitializer: SQL.js already initialized");
      return SqlJsInitializer.SQL;
    }

    // Track initialization attempts
    SqlJsInitializer.initAttempts++;
    console.log(`SqlJsInitializer: initialization attempt ${SqlJsInitializer.initAttempts}/${SqlJsInitializer.MAX_INIT_ATTEMPTS}`);
    
    if (SqlJsInitializer.initAttempts > SqlJsInitializer.MAX_INIT_ATTEMPTS) {
      console.error(`SqlJsInitializer: exceeded maximum initialization attempts (${SqlJsInitializer.MAX_INIT_ATTEMPTS})`);
      return null;
    }

    // If already initializing, return the existing promise
    if (SqlJsInitializer.isInitializing && SqlJsInitializer.initPromise) {
      console.log("SqlJsInitializer: initialization already in progress, joining existing promise");
      return SqlJsInitializer.initPromise;
    }

    // Add delay for retries with exponential backoff
    if (SqlJsInitializer.initAttempts > 1) {
      const delay = Math.min(1000 * Math.pow(2, SqlJsInitializer.initAttempts - 1), 8000);
      console.log(`SqlJsInitializer: waiting ${delay}ms before retry ${SqlJsInitializer.initAttempts}...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      SqlJsInitializer.isInitializing = true;
      
      // Create a new initialization promise
      SqlJsInitializer.initPromise = new Promise(async (resolve, reject) => {
        try {
          console.log("SqlJsInitializer: initializing SQL.js...");
          
          // Dynamic import of sql.js
          const sqlJs = await import('sql.js');
          console.log("SqlJsInitializer: sql.js module imported successfully");
          
          // Initialize with WASM
          const SQL = await sqlJs.default({
            locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
          });
          
          console.log("SqlJsInitializer: SQL.js initialized successfully with WASM");
          SqlJsInitializer.SQL = SQL;
          SqlJsInitializer.initAttempts = 0; // Reset attempts on success
          
          resolve(SQL);
        } catch (error) {
          console.error("SqlJsInitializer: error initializing SQL.js:", error);
          
          // If using CDN failed, try using local WASM
          try {
            console.log("SqlJsInitializer: retrying with local WASM...");
            const sqlJs = await import('sql.js');
            
            const SQL = await sqlJs.default();
            console.log("SqlJsInitializer: SQL.js initialized successfully with local WASM");
            
            SqlJsInitializer.SQL = SQL;
            SqlJsInitializer.initAttempts = 0; // Reset attempts on success
            
            resolve(SQL);
          } catch (retryError) {
            console.error("SqlJsInitializer: error initializing SQL.js with local WASM:", retryError);
            reject(retryError);
          }
        } finally {
          SqlJsInitializer.isInitializing = false;
        }
      });
      
      return await SqlJsInitializer.initPromise;
    } catch (error) {
      console.error("SqlJsInitializer: error in initialization wrapper:", error);
      SqlJsInitializer.isInitializing = false;
      SqlJsInitializer.initPromise = null;
      
      return null;
    }
  }

  /**
   * Get the SQL instance
   */
  static getSQL(): any {
    return SqlJsInitializer.SQL;
  }

  /**
   * Reset initialization attempts
   */
  static resetInitializationAttempts(): void {
    SqlJsInitializer.initAttempts = 0;
    console.log("SqlJsInitializer: initialization attempts reset");
  }

  /**
   * Check if SQL.js is initialized
   */
  static isInitialized(): boolean {
    return !!SqlJsInitializer.SQL;
  }
}
