
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

  // Static methods to access and modify the private static property
  static isInitializationInProgress(): boolean {
    return BaseDatabaseManager.initializationInProgress;
  }

  static setInitializationInProgress(value: boolean): void {
    BaseDatabaseManager.initializationInProgress = value;
  }

  async init() {
    // Si déjà initialisé et que la base de données existe, retournez simplement true
    if (this.initialized && this.db) {
      console.log("Database already initialized.");
      return true;
    }
    
    // Si l'initialisation est déjà en cours, attendez qu'elle se termine
    if (BaseDatabaseManager.initializationInProgress) {
      console.log("Database initialization in progress, waiting...");
      // Attendre que l'initialisation en cours se termine
      while (BaseDatabaseManager.initializationInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      // Vérifier si l'initialisation a réussi
      if (this.initialized && this.db) {
        return true;
      }
    }

    // Marquer le début de l'initialisation
    BaseDatabaseManager.initializationInProgress = true;

    try {
      console.log(`Starting database initialization (attempt ${++BaseDatabaseManager.initializationAttempts})...`);
      
      // Si trop de tentatives, attendez un peu plus longtemps avant de réessayer
      if (BaseDatabaseManager.initializationAttempts > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * BaseDatabaseManager.initializationAttempts));
      }
      
      // Abandonner après trop de tentatives
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
        console.log("Initializing SQL.js with dynamic import...");
        // Utiliser l'import dynamique pour SQL.js avec gestion d'erreur améliorée
        const SQL = await initSqlJs().catch(async (err) => {
          console.error("Error with default SQL.js initialization:", err);
          console.log("Trying with fixed path...");
          
          // Essayer avec un chemin explicite
          return await initSqlJs({
            locateFile: () => '/sql-wasm.wasm'
          });
        });
        
        console.log("SQL.js initialized successfully");
        this.db = new SQL.Database();
        this.initialized = true;
        
        // Réinitialiser le compteur de tentatives après un succès
        BaseDatabaseManager.initializationAttempts = 0;
        
        return true;
      } catch (sqlError) {
        console.error("All SQL.js initialization attempts failed:", sqlError);
        throw sqlError;
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      // Afficher un message d'erreur plus détaillé
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: `Impossible de charger le moteur de base de données: ${errorMessage.substring(0, 100)}`
      });
      
      this.initialized = false;
      this.db = null;
      return false;
    } finally {
      // S'assurer que le flag d'initialisation en cours est réinitialisé
      BaseDatabaseManager.initializationInProgress = false;
    }
  }

  // Modifié pour retourner un booléen au lieu de void
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

  // Accesseur public pour la propriété db
  getDb() {
    return this.db;
  }

  // Mutateur public pour la propriété db
  setDb(db: any) {
    this.db = db;
    
    // If a query manager exists, update its database reference too
    if (this.queryManager) {
      this.queryManager.setDb(db);
    }
    
    return this;
  }

  // Setter for the query manager
  setQueryManager(queryManager: IQueryManager) {
    this.queryManager = queryManager;
    return this;
  }

  // Accesseur public pour la propriété initialized
  isInitialized() {
    return this.initialized && this.db !== null;
  }

  // Mutateur public pour la propriété initialized
  setInitialized(value: boolean) {
    this.initialized = value;
    return this;
  }

  // Sauvegarder la base de données
  exportData() {
    return this.db?.export();
  }
  
  // Réinitialiser le compteur de tentatives
  static resetInitializationAttempts() {
    BaseDatabaseManager.initializationAttempts = 0;
  }
}
