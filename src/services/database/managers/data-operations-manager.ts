
import { DatabaseManagerCore } from '../database-manager-core';

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
        this.db.close();
      }
      // This is a stub implementation
      console.warn("importData not fully implemented in DataOperationsManager");
      return false;
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
