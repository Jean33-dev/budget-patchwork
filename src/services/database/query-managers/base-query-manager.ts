
import { QueryManager } from '../query-manager';
import { toast } from "@/components/ui/use-toast";

export abstract class BaseQueryManager {
  protected parent: QueryManager;

  constructor(parent: QueryManager) {
    this.parent = parent;
  }

  protected async ensureParentInitialized(): Promise<boolean> {
    try {
      const initialized = await this.parent.ensureInitialized();
      if (!initialized) {
        console.error("Failed to ensure parent query manager is initialized");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error ensuring parent query manager is initialized:", error);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: "Impossible d'initialiser le gestionnaire de requêtes"
      });
      return false;
    }
  }

  protected getDb(): any {
    const db = this.parent.getDb();
    if (!db) {
      console.error("Database reference is null in BaseQueryManager.getDb()");
      throw new Error("Database reference is null");
    }
    return db;
  }
  
  protected async query(sql: string, params: any[] = []): Promise<any[]> {
    try {
      const db = this.getDb();
      return await db.exec(sql, params);
    } catch (error) {
      this.logError(`executing query: ${sql}`, error);
      throw error;
    }
  }
  
  protected async run(sql: string, params: any[] = []): Promise<void> {
    try {
      const db = this.getDb();
      await db.exec(sql, params);
    } catch (error) {
      this.logError(`executing run: ${sql}`, error);
      throw error;
    }
  }
  
  protected logError(operation: string, error: any): void {
    console.error(`Query error during ${operation}:`, error);
    toast({
      variant: "destructive",
      title: "Erreur de requête",
      description: `Une erreur est survenue lors de l'opération ${operation}`
    });
  }
}
