
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
    ('bud_1', 'Courses', 500.00, 600.00, 'budget', 0),
    ('bud_2', 'Transport', 200.00, 0.00, 'budget', 0),
    ('bud_3', 'Loisirs', 150.00, 0.00, 'budget', 0),
    ('bud_4', 'Restaurant', 300.00, 150.00, 'budget', 0),
    ('bud_5', 'Shopping', 250.00, 100.00, 'budget', 0)
  `,
  
  expenseSampleData: (currentDate: string) => `
    INSERT OR IGNORE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date)
    VALUES 
    ('exp_1', 'Courses Carrefour', 350.00, 0, 'expense', 'bud_1', ?),
    ('exp_2', 'Courses Lidl', 250.00, 0, 'expense', 'bud_1', ?),
    ('exp_3', 'Restaurant italien', 150.00, 0, 'expense', 'bud_4', ?),
    ('exp_4', 'Vêtements', 100.00, 0, 'expense', 'bud_5', ?)
  `,
  
  getAll: (db: any): Budget[] => {
    try {
      console.log("Exécution de la requête pour récupérer tous les budgets");
      const result = db.exec('SELECT * FROM budgets');
      
      if (!result || result.length === 0) {
        console.log("Aucun budget trouvé dans la base de données");
        return [];
      }
      
      const budgets = result[0]?.values?.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: row[2],
        spent: row[3],
        type: row[4] as 'budget',
        carriedOver: row[5] || 0
      })) || [];
      
      console.log(`${budgets.length} budgets récupérés avec succès`);
      return budgets;
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les budgets depuis la base de données."
      });
      return [];
    }
  },
  
  add: (db: any, budget: Budget): void => {
    try {
      console.log("Ajout d'un nouveau budget:", budget);
      
      if (!budget || !budget.id || !budget.title) {
        throw new Error("Données de budget invalides pour l'ajout");
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
      console.log("Budget ajouté avec succès:", budget.title);
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
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
