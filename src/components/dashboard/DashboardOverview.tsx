
import { useState, useEffect } from "react";
import { BudgetStats } from "@/components/dashboard/BudgetStats";
import { EnvelopeManager } from "@/components/dashboard/EnvelopeManager";
import { ChartSection } from "@/components/dashboard/ChartSection";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useBudgetData } from "@/hooks/useBudgetData";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";

interface DashboardOverviewProps {
  dashboardId: string;
  isDefaultDashboard: boolean;
}

export const DashboardOverview = ({ dashboardId, isDefaultDashboard }: DashboardOverviewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEnvelopes, setShowEnvelopes] = useState(true);
  
  // Charger les données budgétaires
  const { budgets, totalRevenues, totalExpenses, isLoading: budgetsLoading } = useBudgetData();
  
  // Charger les dépenses liées au tableau de bord actuel
  const { expenses, isLoading: expensesLoading } = useExpenseManagement(null);
  
  // Redirige vers la page de budgets
  const handleManageBudgets = () => {
    navigate(isDefaultDashboard ? "/dashboard/budget/budgets" : `/dashboard/${dashboardId}/budgets`);
  };

  // Redirige vers la page de dépenses
  const handleManageExpenses = () => {
    navigate(isDefaultDashboard ? "/dashboard/budget/expenses" : `/dashboard/${dashboardId}/expenses?dashboardId=${dashboardId}`);
  };

  // Redirige vers la page de revenus
  const handleManageIncomes = () => {
    navigate(isDefaultDashboard ? "/dashboard/budget/income" : `/dashboard/${dashboardId}/income?dashboardId=${dashboardId}`);
  };

  // Redirige vers la page de catégories
  const handleManageCategories = () => {
    navigate(isDefaultDashboard ? "/dashboard/budget/categories" : `/dashboard/${dashboardId}/categories?dashboardId=${dashboardId}`);
  };

  // Affiche ou masque les enveloppes
  const toggleEnvelopes = () => {
    setShowEnvelopes(!showEnvelopes);
  };

  // Redirige vers la page de transition de budget
  const handleTransitionBudget = () => {
    navigate(isDefaultDashboard ? "/dashboard/budget/transition" : `/dashboard/${dashboardId}/transition?dashboardId=${dashboardId}`);
  };

  // Exporter en PDF
  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "Fonctionnalité en développement"
    });
  };

  const isLoading = budgetsLoading || expensesLoading;

  return (
    <div className="space-y-8">
      <BudgetStats 
        totalRevenues={totalRevenues}
        totalExpenses={totalExpenses}
        isLoading={isLoading}
      />
      
      <Separator />
      
      <OverviewStats 
        budgets={budgets}
        expenses={expenses}
        onManageBudgets={handleManageBudgets}
        onManageExpenses={handleManageExpenses}
        onManageIncomes={handleManageIncomes}
        onManageCategories={handleManageCategories}
        isLoading={isLoading}
      />
      
      <Separator />
      
      <ChartSection 
        budgets={budgets}
        expenses={expenses}
        isLoading={isLoading}
      />
      
      <Separator />
      
      <EnvelopeManager 
        budgets={budgets}
        expenses={expenses}
        showEnvelopes={showEnvelopes}
        toggleEnvelopes={toggleEnvelopes}
        handleTransitionBudget={handleTransitionBudget}
        handleExportPDF={handleExportPDF}
        isLoading={isLoading}
      />
    </div>
  );
};
