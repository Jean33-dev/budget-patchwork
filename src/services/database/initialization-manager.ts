
import { BaseDatabaseManager } from './base-database-manager';
import { toast } from "@/components/ui/use-toast";

export class DatabaseInitializationManager extends BaseDatabaseManager {
  private initPromise: Promise<boolean> | null = null;

  async ensureInitialized(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }
    return this.init();
  }

  async init(): Promise<boolean> {
    // If initialization is already in progress, return the existing promise
    if (this.initPromise) {
      console.log("Initialization already in progress, waiting for it to complete...");
      return this.initPromise;
    }
    
    // If already initialized, simply return true
    if (this.initialized) {
      console.log("Database already initialized.");
      return true;
    }
    
    // Create a new initialization promise
    this.initPromise = this.performInit();
    
    try {
      // Wait for initialization to complete
      const result = await this.initPromise;
      return result;
    } finally {
      // Reset the promise once initialization is complete
      this.initPromise = null;
    }
  }

  private async performInit(): Promise<boolean> {
    try {
      console.log("Database initialization manager initializing...");
      
      // Initialize the database instance
      const success = await super.init();
      
      if (!success) {
        console.error("Failed to initialize database");
        toast({
          variant: "destructive",
          title: "Database error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        return false;
      }
      
      this.initialized = true;
      console.log("Database initialization manager initialized successfully");
      return true;
    } catch (err) {
      console.error('Error initializing database:', err);
      toast({
        variant: "destructive",
        title: "Database error",
        description: "Unable to initialize the database. Please refresh the page."
      });
      this.initialized = false;
      this.db = null;
      return false;
    }
  }

  getDb() {
    return this.db;
  }
}
