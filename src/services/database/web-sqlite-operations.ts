
/**
 * Module for SQL.js database operations
 */

import { SqlJsInitializer } from './sql-js-initializer';

export class WebSQLiteOperations {
  /**
   * Execute a SQLite query
   */
  static async execute(db: any, query: string, params: any[] = []): Promise<any> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    
    try {
      return db.exec(query, params);
    } catch (error) {
      SqlJsInitializer.logError("execute", error);
      throw error;
    }
  }

  /**
   * Execute a set of SQLite queries
   */
  static async executeSet(db: any, queries: string[]): Promise<any> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    
    try {
      for (const query of queries) {
        db.exec(query);
      }
      return true;
    } catch (error) {
      SqlJsInitializer.logError("executeSet", error);
      throw error;
    }
  }

  /**
   * Execute a SQLite query without result (INSERT, UPDATE, DELETE)
   */
  static async run(db: any, query: string, params: any[] = []): Promise<any> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    
    try {
      const stmt = db.prepare(query);
      const result = stmt.run(params);
      stmt.free();
      return result;
    } catch (error) {
      SqlJsInitializer.logError("run", error);
      throw error;
    }
  }

  /**
   * Execute a SQLite query and return the results (SELECT)
   */
  static async query(db: any, query: string, params: any[] = []): Promise<any[]> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    
    try {
      const stmt = db.prepare(query);
      const results: any[] = [];
      
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      
      stmt.free();
      return results;
    } catch (error) {
      SqlJsInitializer.logError("query", error);
      throw error;
    }
  }

  /**
   * Import data into the database
   */
  static importData(SQL: any, data: Uint8Array): any {
    try {
      if (!SQL) {
        throw new Error("SQL.js is not initialized");
      }
      
      return new SQL.Database(data);
    } catch (error) {
      SqlJsInitializer.logError("importData", error);
      throw error;
    }
  }
}
