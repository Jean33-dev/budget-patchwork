import { Budget } from '../models/budget';
import { toast } from "@/components/ui/use-toast";

export const budgetQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      type TEXT,
      carriedOver REAL DEFAULT 0
    )
  `,
  
  sampleData: (currentDate: string) => `
    INSERT OR IGNORE INTO budgets (id, title, budget, spent, type, carriedOver)
    VALUES 
    ('bud_1', 'Courses', 500.00, 150.00, 'budget', 0),
    ('bud_2', 'Transport', 200.00, 50.00, 'budget', 0),
    ('bud_3', 'Loisirs', 150.00, 30.00, 'budget', 0),
    ('bud_4', 'Restaurant', 300.00, 100.00, 'budget', 0),
    ('bud_5', 'Shopping', 250.00, 75.00, 'budget', 0)
  `,
  
  expenseSampleData: (currentDate: string) => `
    INSERT OR IGNORE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date)
    VALUES 
    (?, ?, ?, ?, ?, ?, ?)
  `,
  
  getAll: (db: any): Budget[] => {
    try {
      console.log("Executing query to retrieve all budgets");
      if (!db) {
        console.error("Error: Database is null");
        return [];
      }
      
      // Use a more robust query approach
      let result;
      try {
        result = db.exec('SELECT * FROM budgets');
      } catch (sqlError) {
        console.error("SQL error when selecting budgets:", sqlError);
        
        // Try to create the table and retry if it doesn't exist
        try {
          db.run(budgetQueries.createTable);
          result = db.exec('SELECT * FROM budgets');
        } catch (retryError) {
          console.error("Failed to create and query budgets table:", retryError);
          return [];
        }
      }
      
      if (!result || result.length === 0) {
        console.log("No budgets found in database");
        return [];
      }
      
      const budgets = result[0]?.values?.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: parseFloat(row[2]) || 0,
        spent: parseFloat(row[3]) || 0,
        type: row[4] as 'budget',
        carriedOver: parseFloat(row[5]) || 0
      })) || [];
      
      console.log(`${budgets.length} budgets successfully retrieved`);
      return budgets;
    } catch (error) {
      console.error("Error retrieving budgets:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to retrieve budgets from the database."
      });
      return [];
    }
  },
  
  add: (db: any, budget: Budget): void => {
    try {
      console.log("Adding new budget:", budget);
      
      if (!budget || !budget.id || !budget.title) {
        throw new Error("Invalid budget data for addition");
      }
      
      const stmt = db.prepare(
        'INSERT INTO budgets (id, title, budget, spent, type, carriedOver) VALUES (?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        budget.id,
        budget.title,
        budget.budget || 0,
        budget.spent || 0,
        budget.type || 'budget',
        budget.carriedOver || 0
      ]);
      
      stmt.free();
      console.log("Budget successfully added:", budget.title);
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  },
  
  update: (db: any, budget: Budget): void => {
    try {
      console.log("Mise à jour du budget:", budget);
      
      if (!budget || !budget.id) {
        throw new Error("Données de budget invalides pour la mise à jour");
      }
      
      const stmt = db.prepare(
        'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ? WHERE id = ?'
      );
      
      stmt.run([
        budget.title,
        budget.budget || 0,
        budget.spent || 0,
        budget.carriedOver || 0,
        budget.id
      ]);
      
      stmt.free();
      console.log("Budget mis à jour avec succès:", budget.title);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du budget:", error);
      throw error;
    }
  },
  
  delete: (db: any, id: string): void => {
    try {
      console.log("Suppression du budget:", id);
      
      if (!id) {
        throw new Error("ID de budget manquant pour la suppression");
      }
      
      // Vérifier d'abord si le budget existe
      const checkStmt = db.prepare('SELECT id FROM budgets WHERE id = ?');
      checkStmt.step([id]);
      const exists = checkStmt.getAsObject();
      checkStmt.free();
      
      if (!exists.id) {
        console.warn(`Budget avec l'ID ${id} non trouvé pour la suppression`);
        return;
      }
      
      // Si le budget existe, le supprimer
      const deleteStmt = db.prepare('DELETE FROM budgets WHERE id = ?');
      deleteStmt.run([id]);
      deleteStmt.free();
      
      console.log(`Budget ${id} supprimé avec succès`);
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      throw error;
    }
  }
};
