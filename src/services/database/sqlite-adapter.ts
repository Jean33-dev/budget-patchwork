
import { toast } from "@/components/ui/use-toast";
import { DiskSpaceChecker } from './disk-space-checker';

export interface SQLiteInterface {
  execute(query: string, params?: any[]): Promise<any>;
  executeSet(queries: string[]): Promise<any>;
  run(query: string, params?: any[]): Promise<any>;
  query(query: string, params?: any[]): Promise<any[]>;
  close(): Promise<void>;
}

/**
 * Classe d'adaptateur abstraite qui sera implémentée pour SQL.js et Capacitor SQLite
 * Cette classe sert de pont entre notre logique métier et la technologie de base de données
 */
export abstract class SQLiteAdapter {
  protected initialized = false;

  abstract init(): Promise<boolean>;
  abstract execute(query: string, params?: any[]): Promise<any>;
  abstract executeSet(queries: string[]): Promise<any>;
  abstract run(query: string, params?: any[]): Promise<any>;
  abstract query(query: string, params?: any[]): Promise<any[]>;
  abstract close(): Promise<void>;
  abstract isInitialized(): boolean;

  async ensureInitialized(): Promise<boolean> {
    if (!this.initialized) {
      return await this.init();
    }
    return true;
  }

  logError(operation: string, error: any): void {
    console.error(`SQLite error during ${operation}:`, error);
    toast({
      variant: "destructive",
      title: "Erreur de base de données",
      description: `Une erreur est survenue: ${error.message || "Erreur inconnue"}`
    });
  }

  /**
   * Vérifier s'il y a assez d'espace pour l'opération d'écriture
   * @param estimatedSize Taille estimée en octets de l'opération
   */
  async checkDiskSpace(estimatedSize?: number): Promise<boolean> {
    return await DiskSpaceChecker.hasEnoughSpace(estimatedSize);
  }
}

/**
 * Détecte l'environnement d'exécution (web ou natif) et retourne l'adaptateur approprié
 */
export const createSQLiteAdapter = async (): Promise<SQLiteAdapter> => {
  // Vérifier si l'application s'exécute dans un environnement Capacitor
  const isCapacitorEnvironment = typeof (window as any)?.Capacitor?.isNativePlatform === 'function' && 
                               (window as any).Capacitor.isNativePlatform();
  
  if (isCapacitorEnvironment) {
    console.log("Environnement Capacitor détecté, chargement de l'adaptateur SQLite natif");
    
    try {
      // Importation dynamique pour éviter les erreurs dans un environnement web
      const { CapacitorSQLiteAdapter } = await import('./capacitor-sqlite-adapter');
      return new CapacitorSQLiteAdapter();
    } catch (error) {
      console.error("Erreur lors du chargement de l'adaptateur Capacitor SQLite:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Impossible de charger l'adaptateur SQLite natif. Utilisation de la version web."
      });
      
      // Fallback vers SQL.js si l'importation de Capacitor SQLite échoue
      const { WebSQLiteAdapter } = await import('./web-sqlite-adapter');
      return new WebSQLiteAdapter();
    }
  } else {
    console.log("Environnement web détecté, chargement de SQL.js");
    const { WebSQLiteAdapter } = await import('./web-sqlite-adapter');
    return new WebSQLiteAdapter();
  }
};
