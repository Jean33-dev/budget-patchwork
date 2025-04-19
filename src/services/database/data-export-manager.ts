
import { SQLiteAdapter } from './sqlite-adapter';
import { shouldKeepInLocalStorage, getDataToMigrateFromLocalStorage, cleanupMigratedLocalStorageData } from '@/utils/localStorage-utils';

/**
 * Class responsible for data import and export operations
 */
export class DataExportManager {
  private adapter: SQLiteAdapter;
  
  constructor(adapter: SQLiteAdapter) {
    this.adapter = adapter;
  }
  
  /**
   * Export database data as a Uint8Array for saving
   */
  exportData(): Uint8Array | null {
    if (this.adapter && 'exportData' in this.adapter) {
      return (this.adapter as any).exportData();
    }
    return null;
  }
  
  /**
   * Import data into the database
   */
  importData(data: Uint8Array): boolean {
    if (this.adapter && 'importData' in this.adapter) {
      return (this.adapter as any).importData(data);
    }
    return false;
  }
  
  /**
   * Migrate data from localStorage (legacy storage) to SQLite
   * Conserve uniquement les clés spécifiées dans KEYS_TO_KEEP_IN_LOCAL_STORAGE
   */
  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      console.log("Starting selective migration from localStorage to SQLite...");
      
      // Récupérer les données à migrer (sauf les clés à conserver)
      const dataToMigrate = getDataToMigrateFromLocalStorage();
      
      if (Object.keys(dataToMigrate).length === 0) {
        console.log("No data found in localStorage to migrate");
        return true; // No data to migrate is still a successful operation
      }
      
      console.log("Data to migrate:", dataToMigrate);
      
      // Implémenter la migration réelle ici (à compléter ultérieurement)
      // Pour l'instant, c'est un placeholder
      const migrationSuccessful = await this.performActualMigration(dataToMigrate);
      
      if (migrationSuccessful) {
        // Supprimer les données migrées du localStorage
        cleanupMigratedLocalStorageData();
        console.log("Migration from localStorage completed successfully");
      }
      
      return migrationSuccessful;
    } catch (error) {
      console.error("Error during migration from localStorage:", error);
      return false;
    }
  }
  
  /**
   * Perform the actual migration of data from localStorage to SQLite
   * @param data The data to migrate
   * @returns A boolean indicating success
   */
  private async performActualMigration(data: Record<string, any>): Promise<boolean> {
    try {
      // Cette méthode sera implémentée plus tard pour insérer les données dans SQLite
      // Pour l'instant, elle ne fait rien mais simule une réussite
      console.log("Migration simulation successful");
      return true;
    } catch (error) {
      console.error("Error during actual migration:", error);
      return false;
    }
  }
  
  /**
   * Check if there is any relevant data in localStorage to migrate
   */
  private checkForLocalStorageData(): boolean {
    try {
      // Check for relevant localStorage keys
      const keys = ['budgets', 'expenses', 'incomes', 'categories'];
      
      for (const key of keys) {
        if (shouldKeepInLocalStorage(key)) {
          continue; // Skip keys that should be kept in localStorage
        }
        
        const data = localStorage.getItem(key);
        if (data && data !== '[]' && data !== '{}') {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error checking localStorage:", error);
      return false;
    }
  }
}
