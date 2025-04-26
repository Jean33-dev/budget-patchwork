
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/services/database";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/hooks/useDashboardContext";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
}

export const DashboardHeader = ({ currentDate, onMonthChange, onBackClick }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [dashboardTitle, setDashboardTitle] = useState("Budget");
  const { budgets, totalRevenues, totalExpenses } = useBudgets();
  const { currentDashboardId } = useDashboardContext();

  useEffect(() => {
    const loadDashboardTitle = async () => {
      try {
        // D'abord, essayer de charger le titre du tableau de bord actuel
        if (currentDashboardId) {
          console.log("DashboardHeader: Chargement du dashboard avec ID:", currentDashboardId);
          const dashboard = await db.getDashboardById(currentDashboardId);
          
          if (dashboard) {
            console.log("DashboardHeader: Dashboard trouvé:", dashboard.title);
            setDashboardTitle(dashboard.title);
            return;
          }
        }
        
        // Fallback: rechercher un tableau de bord avec l'ID "dashboard_title"
        const budgets = await db.getBudgets();
        const dashboardTitleBudget = budgets.find(b => b.id === "dashboard_title");
        
        if (dashboardTitleBudget) {
          console.log("DashboardHeader: Utilisation du titre de fallback:", dashboardTitleBudget.title);
          setDashboardTitle(dashboardTitleBudget.title);
        }
      } catch (error) {
        console.error("DashboardHeader: Erreur lors du chargement du titre:", error);
      }
    };

    loadDashboardTitle();
  }, [currentDashboardId]); // Recharger le titre lorsque l'ID du tableau de bord change

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onBackClick}
          className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h1 className="text-xl">Tableau de bord {dashboardTitle}</h1>
      </div>
      
      <div className="flex justify-end gap-2 mb-4">
        <BudgetPDFDownload
          fileName="rapport-budget.pdf"
          totalIncome={totalRevenues}
          totalExpenses={totalExpenses}
          budgets={budgets}
          className="flex items-center gap-2"
        />
        
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard/budget/transition")}
          className="flex items-center gap-2"
        >
          <CalendarPlus className="h-4 w-4" />
          Nouveau mois
        </Button>
      </div>
    </div>
  );
};
