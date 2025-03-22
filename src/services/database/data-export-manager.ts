
import { BaseDatabaseManager } from './base-database-manager';

export class DataExportManager extends BaseDatabaseManager {
  exportData() {
    if (!this.db) {
      console.error("Database not initialized for data export");
      return null;
    }
    
    try {
      // Export the entire database as a Uint8Array
      const data = this.db.export();
      return data;
    } catch (error) {
      console.error("Error exporting database data:", error);
      return null;
    }
  }
}
