
import { toast } from "@/components/ui/use-toast";
import { DatabaseManagerCore } from './database-manager-core';
import { DatabaseInitManager } from './database-init-manager';
import { BaseDatabaseManager } from './base-database-manager';
import { Database } from "sql.js";
import { SqlJsInitializer } from './sql-js-initializer';

/**
 * Implementation of the main database manager that coordinates all specialized managers
 */
export class DatabaseManagerImpl extends DatabaseManagerCore {
  private initManager: DatabaseInitManager;

  constructor() {
    super();
    this.initManager = new DatabaseInitManager();
    
    // Set query manager in specialized managers
    this.getBudgetManager().setQueryManager(this.queryManager);
    this.getCategoryManager().setQueryManager(this.queryManager);
    this.getExpenseManager().setQueryManager(this.queryManager);
    this.getIncomeManager().setQueryManager(this.queryManager);
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
    SqlJsInitializer.resetInitializationAttempts();
  }

  // Method to set up the database
  protected async setupDatabase(): Promise<Database | null> {
    try {
      console.log("Base DatabaseManagerImpl.setupDatabase() called - should be overridden by subclasses");
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
      if (!this.db) {
        console.error("Database is null, cannot set up schema");
        return false;
      }
      
      // Initialize the tables and schema
      console.log("Initializing database tables...");
      await this.initManager.initializeTables(this.db);
      console.log("Database tables initialized successfully");
      return true;
    } catch (error) {
      console.error('Error setting up database schema:', error);
      return false;
    }
  }
}

// Create the specific implementations for web and Capacitor
export class WebDatabaseManager extends DatabaseManagerImpl {
  protected async setupDatabase(): Promise<Database | null> {
    // Implementation for web (SQL.js)
    try {
      console.log("WebDatabaseManager: Initializing SQL.js...");
      const SQL = await SqlJsInitializer.initialize();
      
      if (!SQL) {
        console.error("WebDatabaseManager: SQL.js initialization failed");
        return null;
      }
      
      console.log("WebDatabaseManager: Creating new SQL.js database instance...");
      return new SQL.Database();
    } catch (error) {
      console.error('WebDatabaseManager: Error initializing SQL.js database:', error);
      return null;
    }
  }
}

export class CapacitorDatabaseManager extends DatabaseManagerImpl {
  protected async setupDatabase(): Promise<Database | null> {
    try {
      console.log("CapacitorDatabaseManager: Initializing database...");
      // Implementation for Capacitor
      // This would use @capacitor-community/sqlite
      // For now, we'll just return null as a placeholder
      return null;
    } catch (error) {
      console.error('CapacitorDatabaseManager: Error initializing Capacitor database:', error);
      return null;
    }
  }
}
