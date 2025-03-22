
import { BaseDatabaseManager } from './base-database-manager';
import { incomeQueries } from './queries/income-queries';
import { expenseQueries } from './queries/expense-queries';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';
import { toast } from "@/components/ui/use-toast";

export class DatabaseInitManager extends BaseDatabaseManager {
  async init() {
    if (this.initialized) return true;

    try {
      // Initialize the base class
      const success = await super.init();
      if (!success) {
        return false;
      }
      
      console.log("Creating database tables...");
      
      // Create tables
      this.db.run(incomeQueries.createTable);
      this.db.run(expenseQueries.createTable);
      this.db.run(budgetQueries.createTable);
      this.db.run(categoryQueries.createTable);

      // Add test data
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Vérifier si des données existent déjà dans les tables
      const budgetsCheck = this.db.exec("SELECT COUNT(*) FROM budgets");
      const budgetsCount = budgetsCheck[0]?.values[0][0] || 0;
      
      if (budgetsCount === 0) {
        console.log("Pas de budgets existants, ajout des données de test...");
        this.db.run(budgetQueries.sampleData(currentDate));
        this.db.run(
          budgetQueries.expenseSampleData(currentDate), 
          [currentDate, currentDate, currentDate, currentDate]
        );
        console.log("Données de test ajoutées avec succès");
      } else {
        console.log(`${budgetsCount} budgets trouvés, pas besoin d'ajouter des données de test`);
      }

      console.log("Base de données initialisée avec succès");
      
      toast({
        title: "Base de données initialisée",
        description: "La base de données a été initialisée avec succès."
      });
      
      return true;

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser la base de données. Veuillez rafraîchir la page."
      });
      throw err;
    }
  }

  async migrateFromLocalStorage() {
    try {
      await this.ensureInitialized();
      
      if (!this.db) {
        throw new Error("Database is null after initialization");
      }
      
      // Migrer les revenus
      const storedIncomes = localStorage.getItem('app_incomes');
      if (storedIncomes) {
        const incomes = JSON.parse(storedIncomes);
        for (const income of incomes) {
          incomeQueries.add(this.db, income);
        }
      }

      // Migrer les dépenses
      const storedExpenses = localStorage.getItem('app_expenses');
      if (storedExpenses) {
        const expenses = JSON.parse(storedExpenses);
        for (const expense of expenses) {
          expenseQueries.add(this.db, expense);
        }
      }

      // Migrer les budgets
      const storedBudgets = localStorage.getItem('app_budgets');
      if (storedBudgets) {
        const budgets = JSON.parse(storedBudgets);
        for (const budget of budgets) {
          budgetQueries.add(this.db, budget);
        }
      }

      // Migrer les catégories
      const storedCategories = localStorage.getItem('app_categories');
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        for (const category of categories) {
          categoryQueries.add(this.db, category);
        }
      }

      // Supprimer les anciennes données du localStorage
      localStorage.removeItem('app_incomes');
      localStorage.removeItem('app_expenses');
      localStorage.removeItem('app_budgets');
      localStorage.removeItem('app_categories');
      
      toast({
        title: "Migration terminée",
        description: "Les données ont été migrées avec succès depuis le localStorage."
      });
    } catch (error) {
      console.error("Erreur lors de la migration depuis localStorage:", error);
      toast({
        variant: "destructive",
        title: "Erreur de migration",
        description: "Impossible de migrer les données depuis le localStorage."
      });
    }
  }
}
