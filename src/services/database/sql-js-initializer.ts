
/**
 * Initializes SQL.js library
 */
export class SqlJsInitializer {
  private static SQL: any = null;
  private static initPromise: Promise<any> | null = null;
  private static initAttempts = 0;
  private static MAX_INIT_ATTEMPTS = 3;
  private static initialized = false;
  private static initStartTime: number | null = null;
  private static MAX_INIT_TIME_MS = 8000; // 8 seconds timeout

  /**
   * Initialize SQL.js
   */
  static async initialize(): Promise<any> {
    // If already successfully initialized, return the SQL instance
    if (this.initialized && this.SQL) {
      console.log("SqlJsInitializer: Already initialized, returning existing SQL instance");
      return this.SQL;
    }

    // If initialization is in progress, check for timeout
    if (this.initPromise) {
      console.log("SqlJsInitializer: Initialization already in progress, checking timeout...");
      
      // Check if initialization has been running too long
      if (this.initStartTime && Date.now() - this.initStartTime > this.MAX_INIT_TIME_MS) {
        console.warn(`SqlJsInitializer: Initialization has been running for more than ${this.MAX_INIT_TIME_MS}ms, resetting state`);
        this.initPromise = null;
        this.initStartTime = null;
      } else {
        console.log("SqlJsInitializer: Returning existing initialization promise");
        return this.initPromise;
      }
    }

    // Track initialization attempts
    this.initAttempts++;
    
    if (this.initAttempts > this.MAX_INIT_ATTEMPTS) {
      console.error(`SqlJsInitializer: Exceeded maximum initialization attempts (${this.MAX_INIT_ATTEMPTS})`);
      return null;
    }

    // Set initialization start time
    this.initStartTime = Date.now();

    // Create a new initialization promise
    this.initPromise = (async () => {
      try {
        console.log(`SqlJsInitializer: Initializing SQL.js (attempt ${this.initAttempts}/${this.MAX_INIT_ATTEMPTS})...`);
        
        // Add delay for retries with exponential backoff
        if (this.initAttempts > 1) {
          const delay = Math.min(1000 * Math.pow(2, this.initAttempts - 1), 8000);
          console.log(`SqlJsInitializer: Waiting ${delay}ms before retry attempt ${this.initAttempts}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Import SQL.js
        const initSqlJs = (await import('sql.js')).default;
        
        // Initialize SQL.js with WASM file
        const SQL = await initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        // Store the initialized SQL instance
        this.SQL = SQL;
        this.initialized = true;
        
        console.log("SqlJsInitializer: SQL.js initialized successfully");
        return SQL;
      } catch (error) {
        console.error("SqlJsInitializer: Error initializing SQL.js:", error);
        // Reset for next attempt
        this.initialized = false;
        return null;
      } finally {
        // Clear the initialization promise and start time
        this.initPromise = null;
        this.initStartTime = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Get the initialized SQL instance
   */
  static getSQL(): any {
    return this.SQL;
  }

  /**
   * Reset initialization attempts
   */
  static resetInitializationAttempts(): void {
    this.initAttempts = 0;
    this.initPromise = null;
    this.initStartTime = null;
    this.initialized = false;
    this.SQL = null;
    console.log("SqlJsInitializer: Reset initialization attempts");
  }
}
