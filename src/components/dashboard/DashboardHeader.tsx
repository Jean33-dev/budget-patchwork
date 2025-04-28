
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarPlus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/services/database";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { EditDashboardDialog } from "./EditDashboardDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dashboard } from "@/services/database/models/dashboard";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
}

export const DashboardHeader = ({ currentDate, onMonthChange, onBackClick }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [dashboardTitle, setDashboardTitle] = useState("");
  const { budgets, totalRevenues, totalExpenses } = useBudgets();
  const { currentDashboardId } = useDashboardContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  const loadDashboardTitle = async () => {
    try {
      if (currentDashboardId) {
        console.log("DashboardHeader: Chargement du dashboard avec ID:", currentDashboardId);
        const dashboard = await db.getDashboardById(currentDashboardId);
        
        if (dashboard) {
          console.log("DashboardHeader: Dashboard trouvé:", dashboard.title);
          setDashboardTitle(dashboard.title);
          return;
        } else {
          console.log("DashboardHeader: Dashboard non trouvé avec ID:", currentDashboardId);
        }
      }
      
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

  const loadDashboards = async () => {
    try {
      const allDashboards = await db.getDashboards();
      console.log("DashboardHeader: Tous les dashboards chargés:", allDashboards);
      setDashboards(allDashboards);
    } catch (error) {
      console.error("DashboardHeader: Erreur lors du chargement des dashboards:", error);
    }
  };

  useEffect(() => {
    loadDashboardTitle();
    loadDashboards();
  }, [currentDashboardId]);

  const handleUpdateDashboard = async (newTitle: string) => {
    try {
      if (!currentDashboardId) return;
      
      const dashboard = await db.getDashboardById(currentDashboardId);
      
      if (dashboard) {
        await db.updateDashboard({
          ...dashboard,
          title: newTitle,
          updatedAt: new Date().toISOString()
        });
        
        setDashboardTitle(newTitle);
        console.log("DashboardHeader: Titre mis à jour avec succès:", newTitle);
      } else {
        console.log("DashboardHeader: Création d'un nouveau dashboard avec ID:", currentDashboardId);
        await db.addDashboard({
          id: currentDashboardId,
          title: newTitle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setDashboardTitle(newTitle);
      }
    } catch (error) {
      console.error("DashboardHeader: Erreur lors de la mise à jour du titre:", error);
      throw error;
    }
  };

  const switchToDashboard = (dashboardId: string) => {
    navigate(`/dashboard/${dashboardId}`);
  };

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

        <div className="flex items-center gap-2 flex-grow">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                <span className="text-xl font-normal">Tableau de bord {dashboardTitle}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {dashboards.map(dashboard => (
                <DropdownMenuItem
                  key={dashboard.id}
                  onClick={() => switchToDashboard(dashboard.id)}
                  className={currentDashboardId === dashboard.id ? "bg-accent" : ""}
                >
                  {dashboard.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Modifier le titre
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      <EditDashboardDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentName={dashboardTitle}
        onSave={handleUpdateDashboard}
      />
    </div>
  );
};
