
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;
  private static initializationPromise: Promise<boolean> | null = null;

  async init() {
    // Si l'initialisation est déjà en cours, attendez-la
    if (BaseDatabaseManager.initializationPromise) {
      console.log("Initialization already in progress, waiting for it to complete...");
      return BaseDatabaseManager.initializationPromise;
    }

    // Si déjà initialisé et la base de données existe, retournez simplement true
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
      console.log("Starting database initialization...");
      
      // Chargement de SQL.js avec plusieurs CDN possibles
      const cdnUrls = [
        'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm',
        'https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.wasm',
        'https://unpkg.com/sql.js@1.8.0/dist/sql-wasm.wasm'
      ];
      
      let SQL = null;
      let lastError = null;
      
      // Tenter chaque CDN jusqu'à ce que l'un fonctionne
      for (const url of cdnUrls) {
        try {
          console.log(`Trying to load SQL.js from: ${url}`);
          SQL = await initSqlJs({
            locateFile: () => url
          });
          console.log(`Successfully loaded SQL.js from: ${url}`);
          break; // Sortir de la boucle si le chargement réussit
        } catch (err) {
          console.error(`Failed to load SQL.js from ${url}:`, err);
          lastError = err;
          // Continuer avec l'URL suivante
        }
      }
      
      if (!SQL) {
        throw lastError || new Error("Failed to load SQL.js from any CDN");
      }
      
      this.db = new SQL.Database();
      this.initialized = true;
      console.log("Database initialized successfully");
      
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      // Afficher un message d'erreur plus détaillé
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: "Impossible de charger le moteur de base de données. Veuillez rafraîchir la page."
      });
      
      this.initialized = false;
      this.db = null;
      return false;
    }
  }

  // Modifiée pour retourner un booléen au lieu de void
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

  // Public getter for the db property
  getDb() {
    return this.db;
  }

  // Public setter for the db property
  setDb(db: any) {
    this.db = db;
    return this;
  }

  // Public getter for the initialized property
  isInitialized() {
    return this.initialized && this.db !== null;
  }

  // Public setter for the initialized property
  setInitialized(value: boolean) {
    this.initialized = value;
    return this;
  }

  // Save database
  exportData() {
    return this.db?.export();
  }
}
