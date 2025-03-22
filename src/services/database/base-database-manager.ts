
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;
  private static initializationPromise: Promise<boolean> | null = null;

  async init() {
    // If initialization is already in progress, wait for it
    if (BaseDatabaseManager.initializationPromise) {
      console.log("Initialization already in progress, waiting for it to complete...");
      return BaseDatabaseManager.initializationPromise;
    }

    // If already initialized and the database exists, simply return true
    if (this.initialized && this.db) {
      console.log("Database already initialized.");
      return true;
    }

    // Set the initialization promise
    BaseDatabaseManager.initializationPromise = this.performInitialization();
    try {
      return await BaseDatabaseManager.initializationPromise;
    } finally {
      // Reset the promise once initialization is complete
      BaseDatabaseManager.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<boolean> {
    try {
      console.log("Starting database initialization...");
      
      // Load SQL.js with multiple possible CDNs
      const cdnUrls = [
        'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm',
        'https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.wasm',
        'https://unpkg.com/sql.js@1.8.0/dist/sql-wasm.wasm',
        // Add the relative path as a last resort
        './sql-wasm.wasm'
      ];
      
      let SQL = null;
      let lastError = null;
      
      // Try each CDN until one works
      for (const url of cdnUrls) {
        try {
          console.log(`Trying to load SQL.js from: ${url}`);
          SQL = await initSqlJs({
            locateFile: () => url
          });
          console.log(`Successfully loaded SQL.js from: ${url}`);
          break; // Exit the loop if loading succeeds
        } catch (err) {
          console.error(`Failed to load SQL.js from ${url}:`, err);
          lastError = err;
          // Continue with the next URL
        }
      }
      
      if (!SQL) {
        throw lastError || new Error("Failed to load SQL.js from any CDN");
      }
      
      this.db = new SQL.Database();
      this.initialized = true;
      console.log("Database initialized successfully");
      
      return true;
    } catch (err) {
      console.error('Error initializing database:', err);
      // Display a more detailed error message
      toast({
        variant: "destructive",
        title: "Database error",
        description: "Unable to load the database engine. Please refresh the page."
      });
      
      this.initialized = false;
      this.db = null;
      return false;
    }
  }

  // Modified to return a boolean instead of void
  protected async ensureInitialized(): Promise<boolean> {
    if (!this.initialized || !this.db) {
      console.log("Database not initialized, initializing now...");
      const success = await this.init();
      console.log("Database initialization status:", success);
      if (!success) {
        console.error("Failed to initialize database");
        return false;
      }
    }
    
    if (!this.db) {
      console.error("Database object is null after initialization");
      return false;
    }
    
    return true;
  }

  // Public getter for the db property
  getDb() {
    return this.db;
  }

  // Public setter for the db property
  setDb(db: any) {
    this.db = db;
    return this;
  }

  // Public getter for the initialized property
  isInitialized() {
    return this.initialized && this.db !== null;
  }

  // Public setter for the initialized property
  setInitialized(value: boolean) {
    this.initialized = value;
    return this;
  }

  // Save database
  exportData() {
    return this.db?.export();
  }
}
