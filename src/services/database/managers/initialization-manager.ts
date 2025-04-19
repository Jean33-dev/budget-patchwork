
import { toast } from "@/components/ui/use-toast";
import { DatabaseManagerCore } from '../database-manager-core';
import { BaseDatabaseManager } from '../base-database-manager';

/**
 * Manager responsible for database initialization
 */
export class InitializationDatabaseManager extends DatabaseManagerCore {
  private initCompletePromise: Promise<boolean> | null = null;
  private initializing = false;

  protected isInitializationInProgress(): boolean {
    return BaseDatabaseManager.isInitializationInProgress();
  }

  protected setInitializationInProgress(value: boolean): void {
    BaseDatabaseManager.setInitializationInProgress(value);
  }

  async init(): Promise<boolean> {
    if (this.initialized && this.db) {
      return true;
    }
    
    if (this.initCompletePromise) {
      console.log("Global database initialization in progress, waiting...");
      try {
        const result = await this.initCompletePromise;
        if (this.initialized && this.db) {
          return true;
        }
      } catch (error) {
        console.error("Global initialization failed, trying local initialization:", error);
      }
    }
    
    if (this.initializing) {
      console.log("Instance database manager initialization already in progress");
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.initialized && this.db !== null;
    }
    
    this.initializing = true;
    const initPromise = this.performInitialization();
    this.initCompletePromise = initPromise;
    
    try {
      return await initPromise;
    } finally {
      this.initializing = false;
      if (this.initCompletePromise === initPromise) {
        this.initCompletePromise = null;
      }
    }
  }

  private async performInitialization(): Promise<boolean> {
    try {
      console.log("Starting database initialization sequence...");
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
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      if (!success) {
        console.error("Failed to initialize database manager after multiple attempts");
        return false;
      }

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
}
