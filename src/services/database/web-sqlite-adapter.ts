import { SQLiteAdapter } from './sqlite-adapter';
import * as sqlJsModule from 'sql.js';

/**
 * Adaptateur SQLite pour environnement web utilisant SQL.js
 */
export class WebSQLiteAdapter extends SQLiteAdapter {
  private db: any = null;
  private static SQL: any = null;
  private static initPromise: Promise<any> | null = null;
  private static initializationInProgress = false;

  constructor() {
    super();
    this.initialized = false;
  }

  /**
   * Initialise SQL.js et crée une base de données en mémoire
   */
  async init(): Promise<boolean> {
    try {
      if (this.initialized && this.db) {
        return true;
      }

      // Si une initialisation est déjà en cours, attendez qu'elle se termine
      if (WebSQLiteAdapter.initializationInProgress) {
        console.log("SQL.js initialization already in progress, waiting...");
        while (WebSQLiteAdapter.initializationInProgress) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Vérifier si SQL a été initialisé avec succès
        if (WebSQLiteAdapter.SQL && !this.db) {
          this.db = new WebSQLiteAdapter.SQL.Database();
          this.initialized = true;
        }
        
        return this.initialized;
      }

      WebSQLiteAdapter.initializationInProgress = true;

      try {
        if (!WebSQLiteAdapter.SQL) {
          console.log("Initializing SQL.js in WebSQLiteAdapter...");
          
          // Liste des sources WASM à essayer
          const wasmSources = [
            // CDN fiables
            "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm",
            "https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.wasm",
            // Chemins locaux
            "/sql-wasm.wasm",
            "./sql-wasm.wasm",
            "sql-wasm.wasm"
          ];
          
          let lastError = null;
          
          // Properly initialize SQL.js using the named exports
          const initSqlJs = sqlJsModule.default || sqlJsModule.initSqlJs;
          
          if (!initSqlJs) {
            throw new Error("SQL.js module could not be loaded. No valid initialization function found.");
          }
          
          // Essayer chaque source jusqu'à ce qu'une fonctionne
          for (const wasmSource of wasmSources) {
            try {
              console.log(`Trying to initialize SQL.js with WASM from: ${wasmSource}`);
              WebSQLiteAdapter.SQL = await initSqlJs({
                locateFile: () => wasmSource
              });
              console.log(`SQL.js initialized successfully with WASM from: ${wasmSource}`);
              break; // Sortir de la boucle si l'initialisation réussit
            } catch (error) {
              console.error(`Failed to initialize with WASM from ${wasmSource}:`, error);
              lastError = error;
            }
          }
          
          // Si aucune source n'a fonctionné, essayer l'initialisation par défaut
          if (!WebSQLiteAdapter.SQL) {
            try {
              console.log("Trying default initialization as last resort");
              WebSQLiteAdapter.SQL = await initSqlJs();
              console.log("SQL.js initialized successfully with default settings");
            } catch (defaultError) {
              console.error("Default initialization failed:", defaultError);
              throw lastError || defaultError;
            }
          }
        }

        if (WebSQLiteAdapter.SQL) {
          this.db = new WebSQLiteAdapter.SQL.Database();
          this.initialized = true;
          return true;
        } else {
          throw new Error("Failed to initialize SQL.js module");
        }
      } catch (error) {
        console.error("All SQL.js initialization methods failed:", error);
        throw error;
      } finally {
        WebSQLiteAdapter.initializationInProgress = false;
      }
    } catch (error) {
      console.error("Error initializing SQL.js:", error);
      this.logError("initialization", error);
      this.initialized = false;
      this.db = null;
      return false;
    }
  }

  /**
   * Exécute une requête SQLite
   */
  async execute(query: string, params: any[] = []): Promise<any> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before executing query");
      }
      return this.db.exec(query, params);
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
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before executing query set");
      }
      
      for (const query of queries) {
        this.db.exec(query);
      }
      return true;
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
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before running query");
      }
      
      const stmt = this.db.prepare(query);
      const result = stmt.run(params);
      stmt.free();
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
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error("Failed to initialize database before querying");
      }
      
      const stmt = this.db.prepare(query);
      const results: any[] = [];
      
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      
      stmt.free();
      return results;
    } catch (error) {
      this.logError("query", error);
      throw error;
    }
  }

  /**
   * Ferme la connexion à la base de données
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }

  /**
   * Vérifie si la base de données est initialisée
   */
  isInitialized(): boolean {
    return this.initialized && this.db !== null;
  }

  /**
   * Exporte les données de la base de données (pour la sauvegarde)
   */
  exportData(): Uint8Array | null {
    if (this.db) {
      return this.db.export();
    }
    return null;
  }

  /**
   * Importe des données dans la base de données
   */
  importData(data: Uint8Array): boolean {
    try {
      if (!WebSQLiteAdapter.SQL) {
        return false;
      }
      
      if (this.db) {
        this.db.close();
      }
      
      this.db = new WebSQLiteAdapter.SQL.Database(data);
      this.initialized = true;
      return true;
    } catch (error) {
      this.logError("importData", error);
      return false;
    }
  }
}
