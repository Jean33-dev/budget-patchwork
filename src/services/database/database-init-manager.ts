
import { SQLiteAdapter, createSQLiteAdapter } from './sqlite-adapter';
import { InitializationManager } from './initialization-manager';
import { toast } from "@/components/ui/use-toast";
import { DataExportManager } from './data-export-manager';

/**
 * Class responsible for database initialization
 */
export class DatabaseInitManager {
  private adapter: SQLiteAdapter | null = null;
  private initialized = false;
  private initializing = false;
  private initAttempts = 0;
  private readonly MAX_INIT_ATTEMPTS = 3;
  private dataExportManager: DataExportManager | null = null;
  
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the current SQLite adapter
   */
  getAdapter(): SQLiteAdapter | null {
    return this.adapter;
  }
  
  /**
   * Get the database instance from the adapter
   */
  getDb(): any {
    return this.adapter ? (this.adapter as any).db : null;
  }
  
  /**
   * Check if the database is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Reset the initialization attempts counter
   */
  resetInitializationAttempts(): void {
    this.initAttempts = 0;
  }
  
  /**
   * Initialize the database with the appropriate adapter
   */
  async init(): Promise<boolean> {
    // Si déjà initialisé, retourne true
    if (this.initialized && this.adapter) {
      console.log("Base de données déjà initialisée");
      return true;
    }
    
    // Si l'initialisation est en cours, attendez
    if (this.initializing) {
      console.log("Initialisation de la base de données en cours...");
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.initialized;
    }
    
    this.initializing = true;
    this.initAttempts++;
    
    try {
      console.log(`Tentative d'initialisation de la base de données (${this.initAttempts}/${this.MAX_INIT_ATTEMPTS})...`);
      
      // Créer l'adaptateur SQLite approprié selon l'environnement
      this.adapter = await createSQLiteAdapter();
      
      // Initialiser l'adaptateur
      const adapterInitialized = await this.adapter.init();
      if (!adapterInitialized) {
        throw new Error("Échec de l'initialisation de l'adaptateur SQLite");
      }
      
      // Create an initialization manager
      const initManager = new InitializationManager(this.adapter);
      
      // Create the database tables
      await initManager.createTables();
      
      // Check if sample data needs to be added
      await initManager.checkAndAddSampleData();
      
      // Initialize the data export manager
      this.dataExportManager = new DataExportManager(this.adapter);
      
      this.initialized = true;
      console.log("Base de données initialisée avec succès");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la base de données:", error);
      
      // Si on n'a pas dépassé le nombre max de tentatives, on peut réessayer automatiquement
      if (this.initAttempts < this.MAX_INIT_ATTEMPTS) {
        this.initializing = false;
        console.log(`Nouvelle tentative d'initialisation (${this.initAttempts + 1}/${this.MAX_INIT_ATTEMPTS})...`);
        // On laisse le code appelant décider s'il faut réessayer
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser la base de données après plusieurs tentatives."
        });
        this.initialized = false;
        this.adapter = null;
      }
      
      return false;
    } finally {
      this.initializing = false;
    }
  }
  
  /**
   * Ensure the database is initialized
   */
  async ensureInitialized(): Promise<boolean> {
    if (!this.initialized || !this.adapter) {
      return await this.init();
    }
    return true;
  }
  
  /**
   * Migrate data from localStorage (legacy storage) to SQLite
   * Implementation delegated to DataExportManager
   */
  async migrateFromLocalStorage(): Promise<boolean> {
    if (!this.adapter || !this.dataExportManager) {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        return false;
      }
      
      if (!this.dataExportManager && this.adapter) {
        this.dataExportManager = new DataExportManager(this.adapter);
      }
    }
    
    if (this.dataExportManager) {
      return await this.dataExportManager.migrateFromLocalStorage();
    }
    
    return false;
  }
}
