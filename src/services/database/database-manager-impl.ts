
import { toast } from "@/components/ui/use-toast";
import { DatabaseManagerCore } from './database-manager-core';
import { DatabaseInitManager } from './database-init-manager';
import { BaseDatabaseManager } from './base-database-manager';

/**
 * Implementation of the main database manager that coordinates all specialized managers
 */
export class DatabaseManagerImpl extends DatabaseManagerCore {
  private initManager: DatabaseInitManager;

  constructor() {
    super();
    this.initManager = new DatabaseInitManager();
  }

  async init(): Promise<boolean> {
    // If already initialized, return true
    if (this.initialized && this.db) {
      return true;
    }
    
    // Use the parent class's method to check initialization status
    if (this.isInitializationInProgress()) {
      console.log("DatabaseManager initialization already in progress, waiting...");
      while (this.isInitializationInProgress()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      // Check if initialization was successful
      if (this.initialized && this.db) {
        return true;
      }
    }
    
    // Use the parent class's method to set initialization status
    this.setInitializationInProgress(true);
    
    try {
      // First initialize the core
      console.log("Initializing database core...");
      const coreSuccess = await super.init();
      if (!coreSuccess) {
        console.error("Failed to initialize database core");
        return false;
      }
      
      try {
        // Initialize the database using the init manager
        console.log("Initializing database using init manager...");
        const success = await this.initManager.init();
        
        if (!success) {
          console.error("Failed to initialize database with init manager");
          return false;
        }
        
        // Share the database instance with all managers
        const dbInstance = this.initManager.getDb();
        if (!dbInstance) {
          console.error("Database instance is null after initialization");
          return false;
        }
        
        return true;
      } catch (err) {
        console.error('Error initializing database managers:', err);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser la base de données. Veuillez rafraîchir la page."
        });
        return false;
      }
    } finally {
      // Use the parent class's method to reset initialization status
      this.setInitializationInProgress(false);
    }
  }
  
  // Method to reset the initialization attempts
  resetInitializationAttempts(): void {
    BaseDatabaseManager.resetInitializationAttempts();
  }

  async migrateFromLocalStorage(): Promise<boolean> {
    return this.initManager.migrateFromLocalStorage();
  }
}
