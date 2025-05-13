
import { db } from "@/services/database";
import { toast } from "@/components/ui/use-toast";

/**
 * Utilitaire de diagnostic pour résoudre les problèmes de dépenses
 */
export const expenseDiagnostic = {
  /**
   * Vérifie la cohérence des données de dépenses
   */
  async diagnoseExpenseIssues(): Promise<string[]> {
    const issues: string[] = [];
    try {
      console.log("⚕️ Diagnostic des dépenses: démarrage");
      
      // 1. Vérifier l'initialisation de la base de données
      try {
        await db.init();
      } catch (error) {
        issues.push("Échec d'initialisation de la base de données");
        console.error("⚕️ Diagnostic: Échec d'initialisation de la base de données", error);
        return issues;
      }
      
      // 2. Charger toutes les dépenses
      const allExpenses = await db.getExpenses();
      console.log(`⚕️ Diagnostic: ${allExpenses.length} dépenses trouvées au total`);
      
      // 3. Analyser les dashboardIds
      const dashboardIdCounts: Record<string, number> = {};
      const missingDashboardIds = allExpenses.filter(expense => !expense.dashboardId).length;
      
      if (missingDashboardIds > 0) {
        issues.push(`${missingDashboardIds} dépense(s) sans dashboardId`);
        console.warn(`⚕️ Diagnostic: ${missingDashboardIds} dépense(s) sans dashboardId`);
      }
      
      allExpenses.forEach(expense => {
        const dashboardId = expense.dashboardId || 'manquant';
        dashboardIdCounts[dashboardId] = (dashboardIdCounts[dashboardId] || 0) + 1;
      });
      
      console.log("⚕️ Diagnostic: Distribution des dépenses par dashboardId:", dashboardIdCounts);
      
      // 4. Vérifier le dashboardId actif
      const currentDashboardId = localStorage.getItem('currentDashboardId');
      console.log(`⚕️ Diagnostic: dashboardId actif dans localStorage: "${currentDashboardId}"`);
      
      if (currentDashboardId) {
        const expensesForCurrentDashboard = dashboardIdCounts[currentDashboardId] || 0;
        console.log(`⚕️ Diagnostic: ${expensesForCurrentDashboard} dépense(s) pour le dashboardId actif`);
        
        if (expensesForCurrentDashboard === 0) {
          issues.push(`Aucune dépense trouvée pour le tableau de bord actif (ID: ${currentDashboardId})`);
        }
      } else {
        issues.push("Aucun tableau de bord actif défini dans localStorage");
      }
      
      // 5. Analyser les structures de données
      const structureIssues = allExpenses.filter(expense => {
        return !expense.id || !expense.title || expense.budget === undefined;
      }).length;
      
      if (structureIssues > 0) {
        issues.push(`${structureIssues} dépense(s) avec une structure de données incorrecte`);
      }
      
      return issues;
    } catch (error) {
      console.error("⚕️ Erreur lors du diagnostic des dépenses:", error);
      issues.push("Erreur lors du diagnostic: " + (error instanceof Error ? error.message : "Erreur inconnue"));
      return issues;
    }
  },
  
  /**
   * Exécute le diagnostic et affiche les résultats dans des toasts
   */
  async runDiagnostic(): Promise<void> {
    try {
      toast({
        title: "Diagnostic en cours",
        description: "Analyse des problèmes potentiels avec les dépenses..."
      });
      
      const issues = await this.diagnoseExpenseIssues();
      
      if (issues.length === 0) {
        toast({
          title: "Diagnostic terminé",
          description: "Aucun problème détecté avec les dépenses."
        });
      } else {
        toast({
          variant: "destructive",
          title: `${issues.length} problème(s) détecté(s)`,
          description: issues.join("; ")
        });
        
        console.error("⚕️ Problèmes détectés lors du diagnostic:", issues);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Échec du diagnostic",
        description: "Une erreur est survenue lors du diagnostic."
      });
      console.error("⚕️ Erreur lors de l'exécution du diagnostic:", error);
    }
  }
};
