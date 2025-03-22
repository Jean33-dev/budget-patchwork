
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;
  private static initializationPromise: Promise<boolean> | null = null;
  private static initializationAttempts = 0;
  private static MAX_ATTEMPTS = 3;

  async init() {
    // Si l'initialisation est déjà en cours, attendez qu'elle se termine
    if (BaseDatabaseManager.initializationPromise) {
      console.log("Initialization already in progress, waiting for it to complete...");
      return BaseDatabaseManager.initializationPromise;
    }

    // Si déjà initialisé et que la base de données existe, retournez simplement true
    if (this.initialized && this.db) {
      console.log("Database already initialized.");
      return true;
    }

    // Définir la promesse d'initialisation
    BaseDatabaseManager.initializationPromise = this.performInitialization();
    try {
      return await BaseDatabaseManager.initializationPromise;
    } finally {
      // Réinitialiser la promesse une fois l'initialisation terminée
      BaseDatabaseManager.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<boolean> {
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
      
      // Utiliser une approche différente pour charger SQL.js
      try {
        console.log("Initializing SQL.js with dynamic import...");
        // Utiliser l'import dynamique pour SQL.js
        const SQL = await initSqlJs({
          // Ne pas utiliser locateFile pour laisser SQL.js trouver automatiquement le fichier wasm
        });
        
        console.log("SQL.js initialized successfully");
        this.db = new SQL.Database();
        this.initialized = true;
        
        // Réinitialiser le compteur de tentatives après un succès
        BaseDatabaseManager.initializationAttempts = 0;
        
        return true;
      } catch (sqlError) {
        console.error("Error initializing SQL.js:", sqlError);
        
        // Essayer avec une autre approche en cas d'échec
        try {
          console.log("Trying alternate initialization method...");
          
          // Si ça échoue, essayez avec un chemin fixe
          const SQL = await initSqlJs({
            locateFile: () => '/sql-wasm.wasm'
          });
          
          console.log("SQL.js initialized successfully with fixed path");
          this.db = new SQL.Database();
          this.initialized = true;
          
          // Réinitialiser le compteur de tentatives après un succès
          BaseDatabaseManager.initializationAttempts = 0;
          
          return true;
        } catch (fixedPathError) {
          console.error("Error with fixed path initialization:", fixedPathError);
          throw fixedPathError;
        }
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
