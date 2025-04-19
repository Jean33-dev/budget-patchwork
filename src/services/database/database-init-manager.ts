
import { WebSQLiteAdapter } from "./web-sqlite-adapter";
import { SQLiteAdapter } from "./sqlite-adapter";
import { createSQLiteAdapter } from "./sqlite-adapter";
import { Database } from "sql.js";
import { InitializationManager } from "./initialization-manager";

/**
 * Manages database initialization
 */
export class DatabaseInitManager {
  private adapter: SQLiteAdapter | null = null;
  private initializationPromise: Promise<boolean> | null = null;
  private isInitializing = false;

  /**
   * Create and initialize an adapter
   */
  async createAdapter(): Promise<SQLiteAdapter | null> {
    try {
      console.log("DatabaseInitManager: Creating SQLite adapter...");
      
      const adapter = await createSQLiteAdapter();
      
      if (!adapter) {
        console.error("DatabaseInitManager: Failed to create SQLite adapter");
        return null;
      }
      
      console.log("DatabaseInitManager: SQLite adapter created");
      
      this.adapter = adapter;
      return adapter;
    } catch (error) {
      console.error("DatabaseInitManager: Error creating SQLite adapter:", error);
      return null;
    }
  }

  /**
   * Initialize the database
   */
  async init(): Promise<boolean> {
    try {
      if (this.adapter?.isInitialized()) {
        console.log("DatabaseInitManager: Adapter already initialized");
        return true;
      }
      
      // If already initializing, return the existing promise
      if (this.isInitializing && this.initializationPromise) {
        console.log("DatabaseInitManager: initialization already in progress, joining existing promise");
        return this.initializationPromise;
      }
      
      this.isInitializing = true;
      
      // Create a new initialization promise
      this.initializationPromise = (async () => {
        try {
          if (!this.adapter) {
            console.log("DatabaseInitManager: No adapter, creating one...");
            this.adapter = await this.createAdapter();
            
            if (!this.adapter) {
              console.error("DatabaseInitManager: Failed to create adapter");
              return false;
            }
          }
          
          console.log("DatabaseInitManager: Initializing adapter...");
          const initialized = await this.adapter.init();
          
          if (!initialized) {
            console.error("DatabaseInitManager: Failed to initialize adapter");
            return false;
          }
          
          console.log("DatabaseInitManager: Adapter initialized successfully");
          return true;
        } catch (error) {
          console.error("DatabaseInitManager: Error initializing adapter:", error);
          return false;
        } finally {
          this.isInitializing = false;
        }
      })();
      
      return await this.initializationPromise;
    } catch (error) {
      console.error("DatabaseInitManager: Error in init wrapper:", error);
      this.isInitializing = false;
      this.initializationPromise = null;
      
      return false;
    }
  }

  /**
   * Get the adapter
   */
  getAdapter(): SQLiteAdapter | null {
    return this.adapter;
  }

  /**
   * Reset the adapter
   */
  resetAdapter(): void {
    this.adapter = null;
    this.initializationPromise = null;
    this.isInitializing = false;
    
    // Also reset the WebSQLiteAdapter's initialization attempts
    WebSQLiteAdapter.resetInitializationAttempts();
  }

  /**
   * Ensure database is initialized
   */
  async ensureInitialized(): Promise<boolean> {
    console.log("DatabaseInitManager: Ensuring database is initialized");
    if (this.adapter?.isInitialized()) {
      return true;
    }
    return await this.init();
  }

  /**
   * Reset initialization attempts
   */
  resetInitializationAttempts(): void {
    console.log("DatabaseInitManager: Resetting initialization attempts");
    // Reset the adapter, which will also reset WebSQLiteAdapter's attempts
    this.resetAdapter();
  }

  /**
   * Initialize database tables
   */
  async initializeTables(db: Database): Promise<boolean> {
    try {
      console.log("DatabaseInitManager: Initializing database tables");
      if (!db) {
        console.error("DatabaseInitManager: No database provided to initialize tables");
        return false;
      }
      
      if (!this.adapter) {
        console.error("DatabaseInitManager: No adapter available to initialize tables");
        return false;
      }
      
      // Create an initialization manager and use it to set up tables
      const initManager = new InitializationManager(this.adapter);
      await initManager.createTables();
      await initManager.checkAndAddSampleData();
      
      console.log("DatabaseInitManager: Database tables initialized successfully");
      return true;
    } catch (error) {
      console.error("DatabaseInitManager: Error initializing tables:", error);
      return false;
    }
  }
}
