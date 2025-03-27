
import { toast } from "@/components/ui/use-toast";
import { QueryManager } from './query-manager';
import { BaseDatabaseManager } from './base-database-manager';

/**
 * Core functionality for the database manager
 */
export class DatabaseManagerCore extends BaseDatabaseManager {
  declare protected queryManager: QueryManager;
  protected initializing = false;
  private static initCompletePromise: Promise<boolean> | null = null;
  private static initializationInProgress = false;

  constructor() {
    super();
    this.queryManager = new QueryManager();
  }

  /**
   * Vérifie si l'initialisation est en cours
   */
  protected isInitializationInProgress(): boolean {
    return DatabaseManagerCore.initializationInProgress;
  }

  /**
   * Définit l'état d'initialisation
   */
  protected setInitializationInProgress(value: boolean): void {
    DatabaseManagerCore.initializationInProgress = value;
  }

  /**
   * Initialize the database manager
   */
  async init(): Promise<boolean> {
    // If already initialized, return true
    if (this.initialized && this.db) {
      return true;
    }
    
    // If a global initialization is in progress, wait for it
    if (DatabaseManagerCore.initCompletePromise) {
      console.log("Global database initialization in progress, waiting...");
      try {
        const result = await DatabaseManagerCore.initCompletePromise;
        // Après l'initialisation globale, vérifions si notre instance est initialisée
        if (this.initialized && this.db) {
          return true;
        }
        // Si pas initialisé malgré l'initialisation globale, continuons avec notre propre init
      } catch (error) {
        console.error("Global initialization failed, trying local initialization:", error);
      }
    }
    
    // If initialization is in progress for this instance, wait
    if (this.initializing) {
      console.log("Instance database manager initialization already in progress");
      // Wait for initialization to complete
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.initialized && this.db !== null;
    }
    
    this.initializing = true;
    
    // Create a promise for others to wait on
    const initPromise = this.performInitialization();
    DatabaseManagerCore.initCompletePromise = initPromise;
    
    try {
      const result = await initPromise;
      return result;
    } finally {
      this.initializing = false;
      // Clear the global promise if this is the one that set it
      if (DatabaseManagerCore.initCompletePromise === initPromise) {
        DatabaseManagerCore.initCompletePromise = null;
      }
    }
  }
  
  /**
   * Internal method to perform the actual initialization
   */
  private async performInitialization(): Promise<boolean> {
    try {
      // Initialize the base database manager
      console.log("Starting database initialization sequence...");
      
      // Essayer d'initialiser plusieurs fois
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`Database initialization attempt ${attempt}...`);
        try {
          success = await super.init();
          if (success) {
            console.log(`Database initialization succeeded on attempt ${attempt}`);
            break;
          }
        } catch (error) {
          console.error(`Error on initialization attempt ${attempt}:`, error);
          if (attempt < 3) {
            // Attendre avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      if (!success) {
        console.error("Failed to initialize database manager after multiple attempts");
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
    }
  }

  /**
   * Check if the database manager is initialized
   */
  isInitialized(): boolean {
    return this.initialized && this.db !== null && super.isInitialized();
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
