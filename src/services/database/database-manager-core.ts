
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from './query-manager';
import { BaseDatabaseManager } from './base-database-manager';

/**
 * Core functionality for the database manager
 */
export class DatabaseManagerCore extends BaseDatabaseManager {
  declare protected queryManager: QueryManager;
  private initialized = false;
  private initializing = false;

  constructor() {
    super();
    this.queryManager = new QueryManager();
  }

  /**
   * Initialize the database manager
   */
  async init(): Promise<boolean> {
    // If already initialized, return true
    if (this.initialized) {
      return true;
    }
    
    // If initialization is in progress, wait
    if (this.initializing) {
      console.log("Database manager initialization already in progress");
      // Wait for initialization to complete
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.initialized;
    }
    
    this.initializing = true;
    
    try {
      // Initialize the base database manager
      console.log("Starting database initialization sequence...");
      const success = await super.init();
      
      if (!success) {
        console.error("Failed to initialize database manager");
        return false;
      }
      
      // Share the database instance with query manager
      this.queryManager.setDb(this.db);
      this.queryManager.setInitialized(true);
      
      this.initialized = true;
      console.log("Database manager fully initialized");
      return true;
    } catch (err) {
      console.error('Error initializing database manager:', err);
      toast({
        variant: "destructive",
        title: "Database error",
        description: "Unable to initialize the database. Please refresh the page."
      });
      return false;
    } finally {
      this.initializing = false;
    }
  }

  /**
   * Check if the database manager is initialized
   */
  isInitialized(): boolean {
    return this.initialized && super.isInitialized();
  }

  /**
   * Export data from the database
   */
  exportData() {
    return this.db?.export();
  }

  /**
   * Ensure that the database manager is initialized
   */
  protected async ensureInitialized(): Promise<boolean> {
    if (!this.isInitialized()) {
      console.log("Database manager not initialized, initializing now...");
      const success = await this.init();
      if (!success) {
        console.error("Failed to initialize database manager");
        toast({
          variant: "destructive",
          title: "Database error",
          description: "Unable to initialize the database. Please refresh the page."
        });
        return false;
      }
    }
    return true;
  }
}
