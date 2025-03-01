
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;

  async init() {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      this.db = new SQL.Database();
      
      // Create tables will be handled by inherited classes
      this.initialized = true;
      console.log("Base de données initialisée");

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      throw err;
    }
  }

  // Helper to ensure database is initialized before operations
  protected async ensureInitialized() {
    if (!this.initialized) await this.init();
  }

  // Save database
  exportData() {
    return this.db?.export();
  }
}
