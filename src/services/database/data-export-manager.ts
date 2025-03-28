
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
   * Placeholder for future implementation
   */
  async migrateFromLocalStorage(): Promise<boolean> {
    // This would contain migration logic from localStorage to SQLite
    // For now, it's just a stub
    return true;
  }
}
