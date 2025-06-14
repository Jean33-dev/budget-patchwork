
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatAmount } from "@/utils/format-amount";
import { useTheme } from "@/context/ThemeContext";

interface OverviewStatsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currency?: "EUR" | "USD" | "GBP";
}

export const OverviewStats = ({
  totalIncome,
  totalExpenses,
  balance,
  currency
}: OverviewStatsProps) => {
  // Prend la devise du context si non forcée via prop
  const { currency: globalCurrency } = useTheme();
  const usedCurrency = currency || globalCurrency;

  return (
    <Card className="shadow-md overflow-hidden border-t-4 border-t-primary backdrop-blur-sm bg-background/90">
      <CardContent className="p-0">
        <div className="divide-y">
          <div className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-budget-income" />
              </div>
              <h3 className="text-base font-medium">Revenus Totaux</h3>
            </div>
            <div className="text-lg font-semibold text-gradient-success">
              {formatAmount(totalIncome, usedCurrency)}
            </div>
          </div>
          <div className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-budget-expense" />
              </div>
              <h3 className="text-base font-medium">Dépenses Totales</h3>
            </div>
            <div className="text-lg font-semibold text-gradient-danger">
              {formatAmount(totalExpenses, usedCurrency)}
            </div>
          </div>
          <div className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-medium">Solde</h3>
            </div>
            <div className={`text-lg font-semibold ${balance >= 0 ? "text-gradient-success" : "text-gradient-danger"}`}>
              {balance >= 0
                ? formatAmount(balance, usedCurrency)
                : `-${formatAmount(Math.abs(balance), usedCurrency)}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
