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
      
      try {
        console.log("Initializing SQL.js with absolute path...");
        try {
          const SQL = await initSqlJs({
            locateFile: (filename) => `/${filename}`
          });
          
          console.log("SQL.js initialized successfully with absolute path");
          this.db = new SQL.Database();
          this.initialized = true;
          BaseDatabaseManager.initializationAttempts = 0;
          return true;
        } catch (absoluteError) {
          console.error("Absolute path initialization failed:", absoluteError);
          
          console.log("Trying with relative path...");
          try {
            const SQL = await initSqlJs({
              locateFile: (filename) => `./${filename}`
            });
            
            console.log("SQL.js initialized successfully with relative path");
            this.db = new SQL.Database();
            this.initialized = true;
            BaseDatabaseManager.initializationAttempts = 0;
            return true;
          } catch (relativeError) {
            console.error("Relative path initialization failed:", relativeError);
            
            for (const path of [
              '/assets/sql-wasm.wasm',
              './assets/sql-wasm.wasm',
              'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm'
            ]) {
              try {
                console.log(`Trying with path: ${path}`);
                const SQL = await initSqlJs({
                  locateFile: () => path
                });
                
                console.log(`SQL.js initialized successfully with path: ${path}`);
                this.db = new SQL.Database();
                this.initialized = true;
                BaseDatabaseManager.initializationAttempts = 0;
                return true;
              } catch (pathError) {
                console.error(`Initialization with path ${path} failed:`, pathError);
              }
            }
            
            console.log("Trying with default initialization...");
            const SQL = await initSqlJs();
            
            console.log("SQL.js initialized successfully with default settings");
            this.db = new SQL.Database();
            this.initialized = true;
            BaseDatabaseManager.initializationAttempts = 0;
            return true;
          }
        }
      } catch (sqlError) {
        console.error("All SQL.js initialization attempts failed:", sqlError);
        throw sqlError;
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
