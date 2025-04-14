
import { toast } from "@/components/ui/use-toast";

/**
 * Web SQLite operations
 */
export class WebSQLiteOperations {
  /**
   * Execute a SQLite query
   */
  static execute(db: any, query: string, params: any[] = []): any {
    try {
      console.log("Executing SQL query:", query, "with params:", params);
      const stmt = db.prepare(query);
      stmt.bind(params);
      const result = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();
      return result;
    } catch (error) {
      console.error("Error executing SQL query:", error);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: `Erreur lors de l'exécution de la requête: ${error}`
      });
      throw error;
    }
  }

  /**
   * Execute a set of SQLite queries
   */
  static executeSet(db: any, queries: string[]): any {
    try {
      console.log("Executing SQL query set, count:", queries.length);
      queries.forEach(query => {
        db.exec(query);
      });
      return true;
    } catch (error) {
      console.error("Error executing SQL query set:", error);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: `Erreur lors de l'exécution des requêtes: ${error}`
      });
      throw error;
    }
  }

  /**
   * Execute a SQLite query without result (INSERT, UPDATE, DELETE)
   */
  static run(db: any, query: string, params: any[] = []): any {
    try {
      console.log("Running SQL query:", query, "with params:", params);
      const stmt = db.prepare(query);
      stmt.bind(params);
      stmt.step();
      stmt.free();
      return true;
    } catch (error) {
      console.error("Error running SQL query:", error);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: `Erreur lors de l'exécution de la requête: ${error}`
      });
      throw error;
    }
  }

  /**
   * Execute a SQLite query and return the results (SELECT)
   */
  static query(db: any, query: string, params: any[] = []): any[] {
    try {
      console.log("Querying SQL:", query, "with params:", params);
      const result: any[] = [];
      const stmt = db.prepare(query);
      stmt.bind(params);
      
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      
      stmt.free();
      console.log(`Query returned ${result.length} results`);
      return result;
    } catch (error) {
      console.error("Error querying SQL:", error);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: `Erreur lors de la requête: ${error}`
      });
      throw error;
    }
  }

  /**
   * Import data into the database
   */
  static importData(SQL: any, data: Uint8Array): any {
    try {
      console.log("Importing database data...");
      return new SQL.Database(data);
    } catch (error) {
      console.error("Error importing database data:", error);
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: `Erreur lors de l'importation des données: ${error}`
      });
      throw error;
    }
  }
}
