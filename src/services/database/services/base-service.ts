
import { DatabaseInitManager } from '../database-init-manager';
import { DataExportManager } from '../data-export-manager';

/**
 * Base service class that provides common functionality for all database services
 */
export class BaseService {
  protected initManager: DatabaseInitManager;
  protected exportManager: DataExportManager | null = null;

  constructor() {
    this.initManager = new DatabaseInitManager();
  }

  /**
   * Initializes the database with the appropriate adapter
   */
  async init(): Promise<boolean> {
    const success = await this.initManager.init();
    
    if (success && this.initManager.getAdapter()) {
      this.exportManager = new DataExportManager(this.initManager.getAdapter()!);
    }
    
    return success;
  }

  /**
   * Resets the counter of initialization attempts
   */
  resetInitializationAttempts(): void {
    this.initManager.resetInitializationAttempts();
  }

  /**
   * Checks if the database is initialized and initializes it if necessary
   */
  protected async ensureInitialized(): Promise<boolean> {
    return await this.initManager.ensureInitialized();
  }

  /**
   * Exports database data
   */
  exportData(): Uint8Array | null {
    if (this.exportManager) {
      return this.exportManager.exportData();
    }
    return null;
  }

  /**
   * Imports data into the database
   */
  importData(data: Uint8Array): boolean {
    if (this.exportManager) {
      return this.exportManager.importData(data);
    }
    return false;
  }
}
