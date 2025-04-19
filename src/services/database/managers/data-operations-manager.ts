
import { DatabaseManagerCore } from '../database-manager-core';

/**
 * Manager responsible for data import/export operations
 */
export class DataOperationsManager extends DatabaseManagerCore {
  exportData() {
    return this.db?.export();
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
}
