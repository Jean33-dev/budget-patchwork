
import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { Capacitor } from '@capacitor/core';

/**
 * Factory for database manager
 */
export class DatabaseManagerFactory {
  private static instance: IDatabaseManager;

  /**
   * Get database manager
   * @returns DatabaseManager
   */
  static getDatabaseManager(): IDatabaseManager {
    if (this.instance) {
      return this.instance;
    }

    // If running in Capacitor, use SQLite
    if (this.isNative()) {
      return this.getCapacitorDatabaseManager();
    }

    // Otherwise, use WebSQL
    return this.getWebDatabaseManager();
  }

  /**
   * Get web database manager
   * @returns WebDatabaseManager
   */
  private static getWebDatabaseManager(): IDatabaseManager {
    if (!this.instance) {
      const { WebDatabaseManager } = require('./database-manager-impl');
      this.instance = new WebDatabaseManager();
    }
    return this.instance;
  }

  /**
   * Get capacitor database manager
   * @returns CapacitorDatabaseManager
   */
  private static getCapacitorDatabaseManager(): IDatabaseManager {
    if (!this.instance) {
      const { CapacitorDatabaseManager } = require('./database-manager-impl');
      this.instance = new CapacitorDatabaseManager();
    }
    return this.instance;
  }

  /**
   * Check if running in a native environment
   * @returns boolean
   */
  private static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }
}
