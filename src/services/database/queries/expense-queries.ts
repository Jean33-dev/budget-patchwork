
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
      date TEXT,
      visible INTEGER DEFAULT 1
    )
  `,
  
  getAll: (db: any): Expense[] => {
    try {
      // Modifier la requête pour ne récupérer que les dépenses visibles
      const result = db.exec('SELECT * FROM expenses WHERE visible = 1 OR visible IS NULL');
      return result[0]?.values?.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        budget: row[2],
        spent: row[3],
        type: row[4] as 'expense',
        linkedBudgetId: row[5],
        date: row[6],
        visible: row[7] === 1 || row[7] === null
      })) || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  },
  
  add: (db: any, expense: Expense): void => {
    try {
      db.run(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [expense.id, expense.title, expense.budget, expense.spent, expense.type, expense.linkedBudgetId, expense.date, expense.visible !== false ? 1 : 0]
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
      throw error;
    }
  },
  
  update: (db: any, expense: Expense): void => {
    try {
      db.run(
        'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ?, visible = ? WHERE id = ?',
        [expense.title, expense.budget, expense.spent, expense.linkedBudgetId, expense.date, expense.visible !== false ? 1 : 0, expense.id]
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une dépense:", error);
      throw error;
    }
  },
  
  // Optimisation de la fonction de masquage pour une meilleure performance
  hideExpense: (db: any, id: string): boolean => {
    try {
      console.log(`Tentative de masquer la dépense avec l'ID: ${id}`);
      
      if (!id) {
        console.error("ID de dépense invalide pour le masquage");
        return false;
      }
      
      // Utiliser une requête plus directe et simplifiée
      db.run('UPDATE expenses SET visible = 0 WHERE id = ?', [id]);
      
      console.log(`Dépense avec l'ID ${id} masquée avec succès`);
      return true;
    } catch (error) {
      console.error(`Erreur lors du masquage de la dépense avec l'ID ${id}:`, error);
      return false;
    }
  },
  
  // Conserver l'ancienne méthode de suppression pour la transition entre mois ou si besoin
  delete: (db: any, id: string): boolean => {
    try {
      console.log(`Tentative de suppression de la dépense avec l'ID: ${id}`);
      
      if (!id) {
        console.error("ID de dépense invalide pour la suppression");
        return false;
      }
      
      db.run('DELETE FROM expenses WHERE id = ?', [id]);
      
      console.log(`Dépense avec l'ID ${id} supprimée avec succès`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la dépense avec l'ID ${id}:`, error);
      return false;
    }
  }
};
