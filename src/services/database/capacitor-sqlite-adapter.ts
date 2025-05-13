
import { SQLiteAdapter } from './sqlite-adapter';
import { toast } from "@/components/ui/use-toast";

/**
 * Adaptateur SQLite pour environnement natif utilisant le plugin Capacitor SQLite
 * Cette classe sera utilisée lorsque l'application sera encapsulée avec Capacitor
 */
export class CapacitorSQLiteAdapter extends SQLiteAdapter {
  private dbName = 'budget-db';
  private dbConnection: any = null;
  
  constructor() {
    super();
    this.initialized = false;
  }

  /**
   * Initialise la connexion à la base de données SQLite native
   */
  async init(): Promise<boolean> {
    try {
      console.log("Initialisation de l'adaptateur Capacitor SQLite...");
      
      // Vérifier si le plugin Capacitor est disponible
      if (typeof (window as any).Capacitor === 'undefined' || 
          !(window as any).Capacitor.isPluginAvailable('CapacitorSQLite')) {
        console.error("Plugin Capacitor SQLite non disponible");
        throw new Error("Plugin Capacitor SQLite non disponible");
      }
      
      // Récupérer le plugin SQLite
      const sqlitePlugin = (window as any).Capacitor.Plugins.CapacitorSQLite;
      
      // Vérifier la connexion
      const result = await sqlitePlugin.checkConnectionsConsistency({
        dbNames: [this.dbName]
      });
      
      // Si la base de données existe déjà, on la ferme d'abord
      if (result.result) {
        await sqlitePlugin.closeConnection({
          database: this.dbName
        });
      }
      
      // Créer ou ouvrir la base de données
      this.dbConnection = await sqlitePlugin.createConnection({
        database: this.dbName,
        encrypted: false,
        mode: 'no-encryption'
      });
      
      // Ouvrir la connexion
      await this.dbConnection.open();
      
      console.log("Connexion SQLite établie avec succès");
      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'adaptateur Capacitor SQLite:", error);
      this.logError("initialization", error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Exécute une requête SQLite
   */
  async execute(query: string, params: any[] = []): Promise<any> {
    try {
      await this.ensureInitialized();
      
      if (!this.dbConnection) {
        throw new Error("Connexion à la base de données non établie");
      }
      
      const result = await this.dbConnection.execute({
        statement: query,
        values: params
      });
      
      return result;
    } catch (error) {
      this.logError("execute", error);
      throw error;
    }
  }

  /**
   * Exécute un ensemble de requêtes SQLite
   */
  async executeSet(queries: string[]): Promise<any> {
    try {
      await this.ensureInitialized();
      
      if (!this.dbConnection) {
        throw new Error("Connexion à la base de données non établie");
      }
      
      // Commence une transaction
      await this.dbConnection.execute({
        statement: "BEGIN TRANSACTION;"
      });
      
      try {
        // Exécute chaque requête
        for (const query of queries) {
          await this.dbConnection.execute({
            statement: query
          });
        }
        
        // Valide la transaction
        await this.dbConnection.execute({
          statement: "COMMIT;"
        });
        
        return true;
      } catch (transactionError) {
        // Annule la transaction en cas d'erreur
        await this.dbConnection.execute({
          statement: "ROLLBACK;"
        });
        
        throw transactionError;
      }
    } catch (error) {
      this.logError("executeSet", error);
      throw error;
    }
  }

  /**
   * Exécute une requête SQLite sans résultat (INSERT, UPDATE, DELETE)
   */
  async run(query: string, params: any[] = []): Promise<any> {
    try {
      await this.ensureInitialized();
      
      if (!this.dbConnection) {
        throw new Error("Connexion à la base de données non établie");
      }
      
      const result = await this.dbConnection.execute({
        statement: query,
        values: params
      });
      
      return result;
    } catch (error) {
      this.logError("run", error);
      throw error;
    }
  }

  /**
   * Exécute une requête SQLite et retourne les résultats (SELECT)
   */
  async query(query: string, params: any[] = []): Promise<any[]> {
    try {
      await this.ensureInitialized();
      
      if (!this.dbConnection) {
        throw new Error("Connexion à la base de données non établie");
      }
      
      const result = await this.dbConnection.query({
        statement: query,
        values: params
      });
      
      // Format le résultat pour correspondre à ce qui est attendu
      if (result && result.values) {
        return result.values;
      }
      
      return [];
    } catch (error) {
      this.logError("query", error);
      throw error;
    }
  }

  /**
   * Ferme la connexion à la base de données
   */
  async close(): Promise<void> {
    if (this.dbConnection) {
      try {
        await this.dbConnection.close();
        this.initialized = false;
        this.dbConnection = null;
      } catch (error) {
        console.error("Erreur lors de la fermeture de la connexion SQLite:", error);
      }
    }
  }

  /**
   * Vérifie si la base de données est initialisée
   */
  isInitialized(): boolean {
    return this.initialized && this.dbConnection !== null;
  }
}
