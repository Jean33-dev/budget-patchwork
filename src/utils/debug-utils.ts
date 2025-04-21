
import { db } from "@/services/database";
import { toast } from "@/components/ui/use-toast";

export const debugDatabase = {
  async showAllTables(): Promise<void> {
    try {
      // Initialize the database first
      await db.init();
      
      // Use direct SQL query from BudgetService to get adapter
      const budgetService = new (await import('@/services/database/services/budget-service')).BudgetService();
      await budgetService.init();
      const adapter = budgetService.getAdapter();
      
      if (!adapter) {
        console.error("Database adapter not available");
        return;
      }
      
      // Liste toutes les tables dans la base de données
      const tables = await adapter.query(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
      );
      
      console.log("===== TABLES IN DATABASE =====");
      tables.forEach((table: any) => {
        console.log(`- ${table.name}`);
      });
      console.log("==============================");
    } catch (error) {
      console.error("Error listing tables:", error);
    }
  },
  
  async debugBudgets(): Promise<void> {
    try {
      if (!await db.init()) {
        console.error("Failed to initialize database");
        return;
      }
      
      // Use direct SQL query from BudgetService to get adapter
      const budgetService = new (await import('@/services/database/services/budget-service')).BudgetService();
      await budgetService.init();
      const adapter = budgetService.getAdapter();
      
      if (!adapter) {
        console.error("Database adapter not available");
        return;
      }
      
      // Requête pour obtenir tous les budgets
      const budgets = await adapter.query("SELECT * FROM budgets");
      
      console.log("===== ALL BUDGETS IN DATABASE =====");
      console.table(budgets);
      console.log("==================================");
      
      // Requête pour compter les budgets par dashboardId
      const budgetsByDashboard = await adapter.query(
        "SELECT dashboardId, COUNT(*) as count FROM budgets GROUP BY dashboardId"
      );
      
      console.log("===== BUDGETS COUNT BY DASHBOARD =====");
      console.table(budgetsByDashboard);
      console.log("======================================");
      
      toast({
        title: "Debug info logged",
        description: `${budgets.length} budgets found in database. Check browser console.`,
      });
    } catch (error) {
      console.error("Error debugging budgets:", error);
      toast({
        variant: "destructive",
        title: "Debug error",
        description: "Error accessing budget data. See console for details.",
      });
    }
  },
  
  async debugDashboards(): Promise<void> {
    try {
      if (!await db.init()) {
        console.error("Failed to initialize database");
        return;
      }
      
      // Use direct SQL query from BudgetService to get adapter
      const budgetService = new (await import('@/services/database/services/budget-service')).BudgetService();
      await budgetService.init();
      const adapter = budgetService.getAdapter();
      
      if (!adapter) {
        console.error("Database adapter not available");
        return;
      }
      
      // Requête pour obtenir tous les dashboards
      const dashboards = await adapter.query("SELECT * FROM dashboards");
      
      console.log("===== ALL DASHBOARDS IN DATABASE =====");
      console.table(dashboards);
      console.log("=====================================");
      
      toast({
        title: "Debug info logged",
        description: `${dashboards.length} dashboards found in database. Check browser console.`,
      });
    } catch (error) {
      console.error("Error debugging dashboards:", error);
      toast({
        variant: "destructive",
        title: "Debug error",
        description: "Error accessing dashboard data. See console for details.",
      });
    }
  }
};
