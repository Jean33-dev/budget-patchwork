import { toast } from "@/components/ui/use-toast";
import { DatabaseManagerCore } from './database-manager-core';
import { DatabaseInitManager } from './database-init-manager';
import { BaseDatabaseManager } from './base-database-manager';
import { Database } from "sql.js";
import { SqlJsInitializer } from './sql-js-initializer';
import { QueryManager } from './query-manager';

/**
 * Implementation of the main database manager that coordinates all specialized managers
 */
export class DatabaseManagerImpl extends DatabaseManagerCore {
  private initManager: DatabaseInitManager;
  private initAttempts = 0;
  private MAX_INIT_ATTEMPTS = 3;
  private initializationStartTime: number | null = null;
  private MAX_INIT_TIME_MS = 10000; // 10 seconds max for initialization

  constructor() {
    super();
    this.initManager = new DatabaseInitManager();
    
    // Set query manager in specialized managers if they exist
    this.queryManager = new QueryManager(this);
  }

  async init(): Promise<boolean> {
    try {
      // If already initialized, return true
      if (this.initialized && this.db) {
        console.log("DatabaseManager already initialized, reusing instance");
        return true;
      }
      
      // Check initialization status
      if (this.isInitializationInProgress()) {
        console.log("DatabaseManager initialization already in progress, checking timeout...");
        
        // Check if initialization has been running too long
        if (this.initializationStartTime && Date.now() - this.initializationStartTime > this.MAX_INIT_TIME_MS) {
          console.warn(`Initialization has been running for more than ${this.MAX_INIT_TIME_MS}ms, resetting state`);
          this.resetInitializationState();
        } else {
          // Otherwise wait for initialization to complete with a timeout
          let waitCount = 0;
          const maxWait = 30; // Maximum number of wait cycles
          
          while (this.isInitializationInProgress() && waitCount < maxWait) {
            await new Promise(resolve => setTimeout(resolve, 100));
            waitCount++;
          }
          
          // Check if initialization was successful
          if (this.initialized && this.db) {
            console.log("DatabaseManager initialization completed while waiting");
            return true;
          }
          
          // If we reached max wait and still not initialized, we'll try again
          if (waitCount >= maxWait) {
            console.log("Waited too long for initialization, starting fresh");
            this.resetInitializationState();
          }
        }
      }
      
      // Track init attempts
      this.initAttempts++;
      if (this.initAttempts > this.MAX_INIT_ATTEMPTS) {
        console.error(`Exceeded maximum DatabaseManager initialization attempts (${this.MAX_INIT_ATTEMPTS})`);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Trop de tentatives d'initialisation de la base de données. Veuillez rafraîchir la page."
        });
        return false;
      }
      
      // Set initialization status and start time
      this.setInitializationInProgress(true);
      this.initializationStartTime = Date.now();
      
      console.log(`DatabaseManager: Initializing (attempt ${this.initAttempts}/${this.MAX_INIT_ATTEMPTS})...`);
      
      // Initialize the database
      const dbInstance = await this.setupDatabase();
      
      if (!dbInstance) {
        console.error("Failed to create database instance");
        this.setInitializationInProgress(false);
        this.initializationStartTime = null;
        return false;
      }
      
      // Store the database instance
      this.db = dbInstance;
      
      // Set up the query manager
      if (this.queryManager) {
        console.log("Setting database in query manager");
        this.queryManager.setDb(this.db);
      } else {
        console.error("Query manager is not initialized");
        this.setInitializationInProgress(false);
        this.initializationStartTime = null;
        return false;
      }
      
      // Initialize database schema
      try {
        console.log("Setting up database schema...");
        const schemaResult = await this.setupDatabaseSchema();
        
        if (!schemaResult) {
          console.error("Failed to set up database schema");
          this.setInitializationInProgress(false);
          this.initializationStartTime = null;
          return false;
        }
        
        // Set as initialized
        this.initialized = true;
        console.log("Database initialized successfully!");
        this.setInitializationInProgress(false);
        this.initializationStartTime = null;
        return true;
      } catch (err) {
        console.error('Error initializing database schema:', err);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser le schéma de base de données."
        });
        this.setInitializationInProgress(false);
        this.initializationStartTime = null;
        return false;
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser la base de données. Veuillez rafraîchir la page."
      });
      this.setInitializationInProgress(false);
      this.initializationStartTime = null;
      return false;
    }
  }
  
  // Reset all initialization state
  private resetInitializationState(): void {
    this.initAttempts = 0;
    this.setInitializationInProgress(false);
    this.initialized = false;
    this.db = null;
    this.initializationStartTime = null;
    console.log("Database initialization state reset completely");
  }
  
  // Method to reset the initialization attempts
  resetInitializationAttempts(): void {
    console.log("Resetting initialization attempts");
    this.resetInitializationState();
    BaseDatabaseManager.resetInitializationAttempts();
    SqlJsInitializer.resetInitializationAttempts();
    this.initManager.resetInitializationAttempts();
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
