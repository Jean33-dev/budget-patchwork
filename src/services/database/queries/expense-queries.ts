
import { Expense } from '../models/expense';

export const expenseQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      type TEXT,
      linkedBudgetId TEXT,
      date TEXT
    )
  `,
  
  getAll: (db: any): Expense[] => {
    try {
      console.log("Récupération de toutes les dépenses...");
      const result = db.exec('SELECT * FROM expenses');
      
      if (!result || !result[0] || !result[0].values) {
        console.log("Aucune dépense trouvée dans la base de données");
        return [];
      }
      
      const expenses = result[0].values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: row[2],
        spent: row[3],
        type: row[4] as 'expense',
        linkedBudgetId: row[5],
        date: row[6]
      }));
      
      console.log(`${expenses.length} dépenses récupérées avec succès`);
      return expenses;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  add: (db: any, expense: Expense): void => {
    try {
      console.log(`Ajout d'une nouvelle dépense: ${expense.title}`);
      db.run(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date]
      );
      console.log(`Dépense ajoutée avec succès: ${expense.id}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      throw error;
    }
  },
  
  update: (db: any, expense: Expense): boolean => {
    try {
      console.log(`Mise à jour de la dépense: ${expense.id}`);
      
      // Vérifier si la dépense existe avant la mise à jour
      const checkStmt = db.prepare('SELECT id FROM expenses WHERE id = ?');
      checkStmt.bind([expense.id]);
      const exists = checkStmt.step();
      checkStmt.free();
      
      if (!exists) {
        console.error(`La dépense avec l'ID ${expense.id} n'existe pas`);
        return false;
      }
      
      // Effectuer la mise à jour
      const updateStmt = db.prepare('UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?');
      updateStmt.bind([expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.id]);
      updateStmt.step();
      updateStmt.free();
      
      console.log(`Dépense mise à jour avec succès: ${expense.id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la dépense ${expense.id}:`, error);
      return false;
    }
  },
  
  delete: (db: any, id: string): boolean => {
    try {
      console.log(`Tentative de suppression de la dépense avec l'ID: ${id}`);
      
      if (!id) {
        console.error("ID de dépense invalide pour la suppression");
        return false;
      }
      
      // Vérifier si la dépense existe avant la suppression
      const checkStmt = db.prepare('SELECT id FROM expenses WHERE id = ?');
      checkStmt.bind([id]);
      const exists = checkStmt.step();
      checkStmt.free();
      
      if (!exists) {
        console.error(`La dépense avec l'ID ${id} n'existe pas`);
        return false;
      }
      
      // Effectuer la suppression
      const deleteStmt = db.prepare('DELETE FROM expenses WHERE id = ?');
      deleteStmt.bind([id]);
      deleteStmt.step();
      deleteStmt.free();
      
      console.log(`Dépense avec l'ID ${id} supprimée avec succès`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la dépense avec l'ID ${id}:`, error);
      return false;
    }
  }
};
