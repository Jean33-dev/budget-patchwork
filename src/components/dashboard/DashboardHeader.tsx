
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Home, Clock, CreditCard, DollarSign, Calendar, CalendarPlus, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/services/database";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { useBudgets } from "@/hooks/useBudgets";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
}

export const DashboardHeader = ({ currentDate, onMonthChange, onBackClick }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [dashboardTitle, setDashboardTitle] = useState("Budget");
  const { budgets, totalRevenues, totalExpenses } = useBudgets();

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
          <DropdownMenuContent align="start" className="bg-background">
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget")} className="gap-2">
              <Home className="h-4 w-4" />
              Tableau de Bord
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/budgets")} className="gap-2">
              <Clock className="h-4 w-4" />
              Gérer les Budgets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/expenses")} className="gap-2">
              <CreditCard className="h-4 w-4" />
              Gérer les Dépenses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/income")} className="gap-2">
              <DollarSign className="h-4 w-4" />
              Gérer les Revenus
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/categories")} className="gap-2">
              <Calendar className="h-4 w-4" />
              Gérer les Catégories
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
