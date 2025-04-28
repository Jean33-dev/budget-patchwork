
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, CalendarPlus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/services/database";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { EditDashboardDialog } from "./EditDashboardDialog";
import { Dashboard } from "@/services/database/models/dashboard";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  const loadDashboards = async () => {
    try {
      const allDashboards = await db.getDashboards();
      console.log("DashboardHeader: Loaded dashboards:", allDashboards);
      setDashboards(allDashboards);
    } catch (error) {
      console.error("DashboardHeader: Error loading dashboards:", error);
    }
  };

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
        } else {
          console.log("DashboardHeader: Dashboard non trouvé avec ID:", currentDashboardId);
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

  useEffect(() => {
    loadDashboardTitle();
    loadDashboards();
  }, [currentDashboardId]); // Recharger le titre lorsque l'ID du tableau de bord change

  const handleUpdateDashboard = async (newTitle: string) => {
    try {
      if (!currentDashboardId) return;
      
      // Mettre à jour le dashboard directement dans la base de données
      const dashboard = await db.getDashboardById(currentDashboardId);
      
      if (dashboard) {
        await db.updateDashboard({
          ...dashboard,
          title: newTitle,
          updatedAt: new Date().toISOString()
        });
        
        // Mettre à jour l'affichage sans attendre le useEffect
        setDashboardTitle(newTitle);
        console.log("DashboardHeader: Titre mis à jour avec succès:", newTitle);
      } else {
        // Si le dashboard n'existe pas, le créer
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

  const handleDashboardChange = (dashboardId: string) => {
    // Naviguer vers le nouveau tableau de bord
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
          <h1 className="text-xl">Tableau de bord</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {dashboardTitle}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {dashboards.map(dashboard => (
                <DropdownMenuItem 
                  key={dashboard.id}
                  onClick={() => handleDashboardChange(dashboard.id)}
                  className={dashboard.id === currentDashboardId ? "bg-muted" : ""}
                >
                  {dashboard.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="border-t mt-1 pt-1">
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
