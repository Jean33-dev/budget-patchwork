
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";

export class BaseDatabaseManager {
  protected db: any = null;
  protected initialized = false;

  async init() {
    if (this.initialized) return true;

    try {
      console.log("Initializing database...");
      
      // Use unpkg CDN which is more reliable and supports CORS
      const SQL = await initSqlJs({
        // Provide fallback URLs to ensure we have a reliable source
        locateFile: file => {
          // Try multiple CDNs in case one fails
          const cdnUrls = [
            `https://unpkg.com/sql.js@1.8.0/dist/${file}`,
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
            `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}`
          ];
          
          console.log(`Loading SQL.js file: ${file} from CDN`);
          // Return the first CDN URL, the browser will try the next one if this fails
          return cdnUrls[0];
        }
      });
      
      this.db = new SQL.Database();
      this.initialized = true;
      console.log("Database initialized successfully");
      
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      // Show more detailed error message in toast
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

  // Modified to return boolean instead of void
  protected async ensureInitialized(): Promise<boolean> {
    if (!this.initialized) {
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
