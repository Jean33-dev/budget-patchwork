
import { SQLiteAdapter } from './sqlite-adapter';
import initSqlJs from 'sql.js';

/**
 * Adaptateur SQLite pour environnement web utilisant SQL.js
 */
export class WebSQLiteAdapter extends SQLiteAdapter {
  private db: any = null;
  private static SQL: any = null;
  private static initPromise: Promise<any> | null = null;

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

      if (!WebSQLiteAdapter.SQL) {
        if (!WebSQLiteAdapter.initPromise) {
          console.log("Initialisation de SQL.js...");
          WebSQLiteAdapter.initPromise = initSqlJs({
            // Laisser SQL.js trouver automatiquement le fichier wasm
          }).catch((err) => {
            console.error("Erreur lors de l'initialisation de SQL.js, tentative avec chemin fixe", err);
            return initSqlJs({
              locateFile: () => '/sql-wasm.wasm'
            });
          });
        }

        WebSQLiteAdapter.SQL = await WebSQLiteAdapter.initPromise;
        console.log("SQL.js initialisé avec succès");
      }

      this.db = new WebSQLiteAdapter.SQL.Database();
      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Erreur d'initialisation de SQL.js:", error);
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
      await this.ensureInitialized();
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
      await this.ensureInitialized();
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
      await this.ensureInitialized();
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
      await this.ensureInitialized();
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
