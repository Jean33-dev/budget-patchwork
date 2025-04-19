
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, CalendarPlus, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/services/database";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
  onExportPDF?: () => void;
}

export const DashboardHeader = ({ currentDate, onMonthChange, onBackClick, onExportPDF }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [dashboardTitle, setDashboardTitle] = useState("Budget");

  // Récupérer le titre du tableau de bord depuis la base de données
  useEffect(() => {
    const loadDashboardTitle = async () => {
      try {
        const budgets = await db.getBudgets();
        const dashboardTitleBudget = budgets.find(b => b.id === "dashboard_title");
        
        if (dashboardTitleBudget) {
          setDashboardTitle(dashboardTitleBudget.title);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du titre:", error);
      }
    };

    loadDashboardTitle();
  }, []);

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget")}>
              Tableau de Bord
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/income")}>
              Gérer les Revenus
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/categories")}>
              Gérer les Catégories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/budgets")}>
              Gérer les Budgets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/expenses")}>
              Gérer les Dépenses
            </DropdownMenuItem>
            {onExportPDF && (
              <DropdownMenuItem onClick={onExportPDF}>
                Exporter en PDF
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-xl">Tableau de bord {dashboardTitle}</h1>
        
        {/* Ajout du bouton d'exportation PDF ici */}
        {onExportPDF && (
          <div className="ml-auto mr-2">
            <Button 
              variant="outline"
              onClick={onExportPDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mb-4">
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
