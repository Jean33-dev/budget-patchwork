import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { Capacitor } from '@capacitor/core';
import { WebDatabaseManager, CapacitorDatabaseManager } from './database-manager-impl';
import { toast } from "@/components/ui/use-toast";

/**
 * Factory for database manager
 */
export class DatabaseManagerFactory {
  private static instance: IDatabaseManager | null = null;
  private static initializationAttempts = 0;
  private static MAX_INIT_ATTEMPTS = 3;
  private static initializationInProgress = false;

  /**
   * Get database manager
   * @returns DatabaseManager
   */
  static getDatabaseManager(): IDatabaseManager {
    if (this.instance) {
      console.log("Returning existing database manager instance");
      return this.instance;
    }

    console.log("Creating new database manager instance");
    
    // If already trying to create an instance, wait before trying again
    if (this.initializationInProgress) {
      console.log("Database manager initialization already in progress");
      
      // Increment attempt counter
      this.initializationAttempts++;
      
      if (this.initializationAttempts > this.MAX_INIT_ATTEMPTS) {
        console.error(`Exceeded maximum database manager initialization attempts (${this.MAX_INIT_ATTEMPTS})`);
        toast({
          variant: "destructive",
          title: "Erreur de base de données",
          description: "Impossible de créer le gestionnaire de base de données après plusieurs tentatives."
        });
      }
    }
    
    this.initializationInProgress = true;
    
    try {
      // If running in Capacitor, use SQLite
      if (this.isNative()) {
        return this.getCapacitorDatabaseManager();
      }

      // Otherwise, use WebSQL
      return this.getWebDatabaseManager();
    } finally {
      this.initializationInProgress = false;
    }
  }

  /**
   * Reset initialization attempts
   */
  static resetInitializationAttempts(): void {
    this.initializationAttempts = 0;
    this.initializationInProgress = false;
    this.instance = null;
  }

  /**
   * Get web database manager
   * @returns WebDatabaseManager
   */
  private static getWebDatabaseManager(): IDatabaseManager {
    if (!this.instance) {
      console.log("Creating new WebDatabaseManager instance");
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
      console.log("Creating new CapacitorDatabaseManager instance");
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
