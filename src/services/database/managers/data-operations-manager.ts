
import { DatabaseManagerCore } from '../database-manager-core';
import { toast } from "@/components/ui/use-toast";

/**
 * Manager responsible for data import/export operations
 */
export class DataOperationsManager extends DatabaseManagerCore {
  exportData() {
    return this.db?.export();
  }

  importData(data: Uint8Array): boolean {
    try {
      if (this.db) {
        console.log("Closing existing database connection...");
        this.db.close();
      }
      
      const SQL = (window as any).SQL;
      if (!SQL) {
        console.error("SQL.js not initialized");
        return false;
      }
      
      console.log("Creating new database from imported data...");
      this.db = new SQL.Database(data);
      this.initialized = !!this.db;
      
      if (this.initialized) {
        console.log("Database successfully imported");
        
        // Vérifier que la base de données contient les tables attendues
        try {
          const tables = this.db.exec("SELECT name FROM sqlite_master WHERE type='table'");
          console.log("Tables in imported database:", tables);
          
          // Vérifier que les tables essentielles sont présentes
          const requiredTables = ['dashboards', 'budgets', 'expenses', 'incomes', 'categories'];
          const foundTables = tables[0]?.values?.map((row: any[]) => row[0]) || [];
          
          for (const table of requiredTables) {
            if (!foundTables.includes(table)) {
              console.error(`Required table '${table}' not found in imported database`);
              toast({
                variant: "destructive",
                title: "Erreur d'importation",
                description: `Table requise '${table}' manquante dans la base de données importée`
              });
              return false;
            }
          }
        } catch (error) {
          console.error("Error checking imported database tables:", error);
        }
        
        return true;
      } else {
        console.error("Failed to initialize database from imported data");
        return false;
      }
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  protected async ensureInitialized(): Promise<boolean> {
    if (!this.isInitialized()) {
      console.log("Database manager not initialized, initializing now...");
      const success = await this.init();
      if (!success) {
        console.error("Failed to initialize database manager");
        return false;
      }
    }
    return true;
  }

  isInitialized(): boolean {
    return this.initialized && this.db !== null && super.isInitialized();
  }
  
  async migrateFromLocalStorage(): Promise<boolean> {
    // Stub implementation to match interface
    console.warn("migrateFromLocalStorage not implemented in DataOperationsManager");
    return false;
  }
}
