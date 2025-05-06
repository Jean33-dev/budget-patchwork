
import { Card, CardContent } from "@/components/ui/card";

interface OverviewStatsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const OverviewStats = ({
  totalIncome,
  totalExpenses,
  balance
}: OverviewStatsProps) => {
  return (
    <Card className="shadow-md overflow-hidden border-t-4 border-t-primary">
      <CardContent className="p-0">
        <div className="divide-y">
          <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <h3 className="text-base font-medium">Revenus Totaux</h3>
            <div className="text-lg font-semibold text-budget-income">
              {totalIncome.toFixed(2)} €
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <h3 className="text-base font-medium">Dépenses Totales</h3>
            <div className="text-lg font-semibold text-budget-expense">
              {totalExpenses.toFixed(2)} €
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors bg-muted/10">
            <h3 className="text-base font-medium">Solde</h3>
            <div className={`text-lg font-semibold ${balance >= 0 ? "text-budget-income" : "text-budget-expense"}`}>
              {balance >= 0 ? balance.toFixed(2) : `-${Math.abs(balance).toFixed(2)}`} €
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
