
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { useTheme } from "@/context/ThemeContext";

interface DashboardActionsProps {
  totalRevenues: number;
  totalExpenses: number;
  budgets: any[];
}

export const DashboardActions = ({
  totalRevenues,
  totalExpenses,
  budgets
}: DashboardActionsProps) => {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
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
        {t("dashboard.newMonth")}
      </Button>
    </div>
  );
};
