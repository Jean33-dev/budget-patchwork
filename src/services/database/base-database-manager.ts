
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;

  async init() {
    if (this.initialized) return;

    try {
      console.log("Initializing database...");
      // Use a more reliable CDN for WebAssembly file
      const SQL = await initSqlJs({
        // Use jsdelivr CDN which is more reliable
        locateFile: file => `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}`
      });
      
      this.db = new SQL.Database();
      this.initialized = true;
      console.log("Database initialized successfully");

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      // Show more detailed error message in toast
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: "Impossible de charger le moteur de base de données. Veuillez rafraîchir la page."
      });
      throw err;
    }
  }

  // Helper to ensure database is initialized before operations
  protected async ensureInitialized() {
    if (!this.initialized) {
      console.log("Database not initialized, initializing now...");
      await this.init();
      console.log("Database initialization status:", this.initialized);
    }
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
    return this.initialized;
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
