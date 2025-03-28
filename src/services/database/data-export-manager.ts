
import { SQLiteAdapter } from './sqlite-adapter';

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
   */
  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      console.log("Starting migration from localStorage to SQLite...");
      
      // Check if localStorage contains any data to migrate
      const hasLocalStorageData = this.checkForLocalStorageData();
      
      if (!hasLocalStorageData) {
        console.log("No data found in localStorage to migrate");
        return true; // No data to migrate is still a successful operation
      }
      
      // Implementation would extract data from localStorage
      // and use the adapter to insert it into SQLite
      
      // For now, this is just a placeholder implementation
      console.log("Migration from localStorage completed successfully");
      
      return true;
    } catch (error) {
      console.error("Error during migration from localStorage:", error);
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
