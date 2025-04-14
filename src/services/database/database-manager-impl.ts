
import { toast } from "@/components/ui/use-toast";
import { DatabaseManagerCore } from './database-manager-core';
import { DatabaseInitManager } from './database-init-manager';
import { BaseDatabaseManager } from './base-database-manager';
import { Database } from "sql.js";

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
    
    // Check initialization status
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
    
    // Set initialization status
    this.setInitializationInProgress(true);
    
    try {
      // Initialize the database
      console.log("Initializing database...");
      const dbInstance = await this.setupDatabase();
      
      if (!dbInstance) {
        console.error("Failed to create database instance");
        return false;
      }
      
      // Store the database instance
      this.db = dbInstance;
      
      // Set up the query manager
      this.queryManager.setDb(this.db);
      
      // Initialize database schema
      try {
        console.log("Setting up database schema...");
        await this.setupDatabaseSchema();
        
        // Set as initialized
        this.initialized = true;
        return true;
      } catch (err) {
        console.error('Error initializing database schema:', err);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser le schéma de base de données."
        });
        return false;
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser la base de données. Veuillez rafraîchir la page."
      });
      return false;
    } finally {
      this.setInitializationInProgress(false);
    }
  }
  
  // Method to reset the initialization attempts
  resetInitializationAttempts(): void {
    BaseDatabaseManager.resetInitializationAttempts();
  }

  // Method to set up the database
  protected async setupDatabase(): Promise<Database | null> {
    try {
      // This would normally create an instance of SQL.js or Capacitor SQLite
      // For demonstration, we'll return null, and subclasses will override this
      return null;
    } catch (error) {
      console.error('Error setting up database:', error);
      return null;
    }
  }
  
  // Method to set up the database schema
  protected async setupDatabaseSchema(): Promise<boolean> {
    try {
      // Initialize the tables and schema
      await this.initManager.initializeTables(this.db!);
      return true;
    } catch (error) {
      console.error('Error setting up database schema:', error);
      return false;
    }
  }
}
