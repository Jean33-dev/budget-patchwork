
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BudgetStats } from "@/components/dashboard/BudgetStats";
import { useBudgets } from "@/hooks/useBudgets";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useDashboardTitle } from "@/hooks/useDashboardTitle";
import { useTheme } from "@/context/ThemeContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [nextDate, setNextDate] = useState<Date | null>(null);
  const { dashboardTitle } = useDashboardTitle();
  const { currency: globalCurrency, t, language } = useTheme();

  // Utilisation du hook useBudgets pour obtenir toutes les données
  const {
    budgets,
    totalRevenues,
    totalExpenses,
    totalBudgets,
    remainingAmount
  } = useBudgets();

  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
    // Show transition dialog when month is changed
    setNextDate(newDate);
    setShowTransitionDialog(true);
  };

  const handleTransitionConfirm = () => {
    if (nextDate) {
      navigate("/dashboard/budget/transition");
    }
    setShowTransitionDialog(false);
  };

  const handleTransitionCancel = () => {
    setNextDate(null);
    setShowTransitionDialog(false);
  };

  // Créer la liste des enveloppes à partir des budgets
  const envelopes = budgets.map(budget => ({
    id: budget.id,
    title: budget.title,
    budget: budget.budget,
    spent: budget.spent,
    type: budget.type
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      <DashboardHeader
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        onBackClick={() => navigate("/")}
        // Si DashboardHeader a des textes, les remplacer par t("...")
      />

      <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>

      <DashboardOverview
        totalIncome={totalRevenues}
        totalExpenses={totalExpenses}
        envelopes={envelopes}
        currency={globalCurrency}
      />

      <BudgetStats
        remainingBudget={remainingAmount}
        remainingBudgetAfterExpenses={totalBudgets - totalExpenses}
        currency={globalCurrency}
        statsTitle={t("dashboard.statsTitle")}
        remainingLabel={t("dashboard.stats.remaining")}
        remainingAfterLabel={t("dashboard.stats.remainingAfter")}
      />

      <AlertDialog open={showTransitionDialog} onOpenChange={setShowTransitionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboard.monthTransition")}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div>
                {t("dashboard.monthTransition") + " ?"}
                {/* On ne peut pas interpoler dashboardTitle sans le remplacer dans les traductions, ci-dessous, version simple */}
              </div>

              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t("dashboard.transitionAlert")}</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    {/* Phrase avec dashboardTitle */}
                    {t("dashboard.transitionWarning").replace("{dashboardTitle}", dashboardTitle || t("dashboard.title"))}
                  </p>
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleTransitionCancel}>{t("dashboard.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleTransitionConfirm}>
              {t("dashboard.confirmTransition")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
