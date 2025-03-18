
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;
  private static initializing = false;
  private static initPromise: Promise<any> | null = null;

  async init(): Promise<boolean> {
    if (this.initialized && this.db) return true;

    try {
      console.log("Initializing database...");
      
      // Use a shared initialization promise to prevent multiple concurrent initializations
      if (BaseDatabaseManager.initializing && BaseDatabaseManager.initPromise) {
        console.log("Database initialization already in progress, waiting...");
        try {
          const SQL = await BaseDatabaseManager.initPromise;
          if (SQL) {
            this.db = new SQL.Database();
            this.initialized = true;
            console.log("Database initialized from existing promise");
            return true;
          }
        } catch (error) {
          console.error("Error while waiting for existing initialization:", error);
          BaseDatabaseManager.initializing = false;
          BaseDatabaseManager.initPromise = null;
        }
      }
      
      BaseDatabaseManager.initializing = true;
      
      // Try using unpkg instead of cdnjs
      BaseDatabaseManager.initPromise = initSqlJs({
        locateFile: file => `https://unpkg.com/sql.js@1.8.0/dist/${file}`
      });
      
      try {
        const SQL = await BaseDatabaseManager.initPromise;
        console.log("SQL.js loaded successfully");
        this.db = new SQL.Database();
        this.initialized = true;
        console.log("Database initialized successfully with new SQL instance");
        return true;
      } catch (initError) {
        console.error("Failed to initialize SQL.js:", initError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Unable to load the database engine. Please refresh and try again."
        });
        this.initialized = false;
        this.db = null;
        BaseDatabaseManager.initializing = false;
        BaseDatabaseManager.initPromise = null;
        return false;
      }
    } catch (err) {
      console.error('Error in database initialization process:', err);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Unable to load the database engine. Please refresh the page."
      });
      
      this.initialized = false;
      this.db = null;
      BaseDatabaseManager.initializing = false;
      BaseDatabaseManager.initPromise = null;
      return false;
    }
  }

  // Helper to ensure database is initialized before operations
  protected async ensureInitialized() {
    if (!this.initialized || !this.db) {
      console.log("Database not initialized, initializing now...");
      const success = await this.init();
      console.log("Database initialization status:", success);
      if (!success) {
        throw new Error("Failed to initialize database");
      }
    }
    
    if (!this.db) {
      console.error("Database object is null after initialization");
      throw new Error("Database object is null");
    }
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
    return this.initialized;
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
