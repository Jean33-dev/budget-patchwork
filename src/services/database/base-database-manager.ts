
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";
import { IQueryManager } from './interfaces/IQueryManager';

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;
  protected queryManager: IQueryManager | null = null;
  private static initializationPromise: Promise<boolean> | null = null;
  private static initializationAttempts = 0;
  private static MAX_ATTEMPTS = 3;
  private static initializationInProgress = false;

  constructor() {
    this.queryManager = null;
  }

  static isInitializationInProgress(): boolean {
    return BaseDatabaseManager.initializationInProgress;
  }

  static setInitializationInProgress(value: boolean): void {
    BaseDatabaseManager.initializationInProgress = value;
  }

  async init() {
    if (this.initialized && this.db) {
      console.log("Database already initialized.");
      return true;
    }
    
    if (BaseDatabaseManager.initializationInProgress) {
      console.log("Database initialization in progress, waiting...");
      while (BaseDatabaseManager.initializationInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.initialized && this.db) {
        return true;
      }
    }

    BaseDatabaseManager.initializationInProgress = true;

    try {
      console.log(`Starting database initialization (attempt ${++BaseDatabaseManager.initializationAttempts})...`);
      
      if (BaseDatabaseManager.initializationAttempts > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * BaseDatabaseManager.initializationAttempts));
      }
      
      if (BaseDatabaseManager.initializationAttempts > BaseDatabaseManager.MAX_ATTEMPTS) {
        console.error(`Abandoning initialization after ${BaseDatabaseManager.MAX_ATTEMPTS} attempts`);
        toast({
          variant: "destructive",
          title: "Erreur critique de base de données",
          description: "Impossible de charger le moteur de base de données après plusieurs tentatives. Veuillez vider le cache et rafraîchir la page."
        });
        return false;
      }
      
      // Updated WASM sources with more reliable CDN options
      const wasmSources = [
        "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm",
        "https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.wasm",
        "/sql-wasm.wasm",
        "./sql-wasm.wasm",
        "sql-wasm.wasm"
      ];
      
      let lastError = null;
      let SQL = null;
      
      for (const wasmSource of wasmSources) {
        try {
          console.log(`Trying to initialize SQL.js with WASM from: ${wasmSource}`);
          
          SQL = await initSqlJs({
            locateFile: () => wasmSource
          });
          
          console.log(`SQL.js initialized successfully with WASM from: ${wasmSource}`);
          break;
        } catch (error) {
          console.error(`Failed to initialize with WASM from ${wasmSource}:`, error);
          lastError = error;
        }
      }
      
      if (!SQL) {
        try {
          console.log("Trying default initialization as last resort");
          SQL = await initSqlJs();
          console.log("SQL.js initialized successfully with default settings");
        } catch (defaultError) {
          console.error("Default initialization failed:", defaultError);
          throw lastError || defaultError;
        }
      }
      
      // Only create the database if we have a valid SQL object
      if (SQL) {
        this.db = new SQL.Database();
        this.initialized = true;
        BaseDatabaseManager.initializationAttempts = 0;
        return true;
      } else {
        throw new Error("Failed to initialize SQL.js module");
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: `Impossible de charger le moteur de base de données: ${errorMessage.substring(0, 100)}`
      });
      
      this.initialized = false;
      this.db = null;
      return false;
    } finally {
      BaseDatabaseManager.initializationInProgress = false;
    }
  }

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

  getDb() {
    return this.db;
  }

  setDb(db: any) {
    this.db = db;
    
    if (this.queryManager) {
      this.queryManager.setDb(db);
    }
    
    return this;
  }

  setQueryManager(queryManager: IQueryManager) {
    this.queryManager = queryManager;
    return this;
  }

  isInitialized() {
    return this.initialized && this.db !== null;
  }

  setInitialized(value: boolean) {
    this.initialized = value;
    return this;
  }

  exportData() {
    return this.db?.export();
  }

  static resetInitializationAttempts() {
    BaseDatabaseManager.initializationAttempts = 0;
  }
}
