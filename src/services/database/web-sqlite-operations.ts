
import { toast } from "@/hooks/use-toast";

/**
 * Helper class for Web SQLite operations
 */
export class WebSQLiteOperations {
  /**
   * Execute a SQLite query
   */
  static execute(db: any, query: string, params: any[] = []): any {
    try {
      console.log(`Executing query: ${query}`, params);
      const stmt = db.prepare(query);
      const result = stmt.getAsObject(params);
      stmt.free();
      return result;
    } catch (error) {
      console.error(`Error executing query: ${query}`, error);
      throw error;
    }
  }

  /**
   * Execute a set of SQLite queries
   */
  static executeSet(db: any, queries: string[]): any {
    try {
      console.log(`Executing ${queries.length} queries`);
      for (const query of queries) {
        db.exec(query);
      }
      return true;
    } catch (error) {
      console.error(`Error executing query set`, error);
      throw error;
    }
  }

  /**
   * Execute a SQLite query without result (INSERT, UPDATE, DELETE)
   */
  static run(db: any, query: string, params: any[] = []): any {
    try {
      console.log(`Running query: ${query}`, params);
      const stmt = db.prepare(query);
      stmt.run(params);
      stmt.free();
      return true;
    } catch (error) {
      console.error(`Error running query: ${query}`, error);
      // Check for specific SQLite errors
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // Handle constraint errors more gracefully
      if (errorMsg.includes('UNIQUE constraint failed')) {
        console.warn(`UNIQUE constraint failed for query: ${query}`);
        return false;
      }
      
      throw error;
    }
  }

  /**
   * Execute a SQLite query and return the results (SELECT)
   */
  static query(db: any, query: string, params: any[] = []): any[] {
    try {
      console.log(`Querying: ${query}`, params);
      const stmt = db.prepare(query);
      const result = [];
      
      // Use step to iterate through results
      while (stmt.step()) {
        const row = stmt.getAsObject();
        result.push(row);
      }
      
      stmt.free();
      console.log(`Query returned ${result.length} results`);
      return result;
    } catch (error) {
      console.error(`Error querying: ${query}`, error);
      throw error;
    }
  }

  /**
   * Import data into the database
   */
  static importData(SQL: any, data: Uint8Array): any {
    try {
      return new SQL.Database(data);
    } catch (error) {
      console.error("Error importing database data:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'importation",
        description: "Impossible d'importer les données de la base de données."
      });
      throw error;
    }
  }
}
