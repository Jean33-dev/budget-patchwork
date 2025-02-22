
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
  return <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="p-2">
        <CardContent className="flex items-center justify-between p-2">
          <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
          <div className="text-lg font-bold text-budget-income">{totalIncome.toFixed(2)} €</div>
        </CardContent>
      </Card>
      <Card className="p-2">
        <CardContent className="flex items-center justify-between p-2">
          <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
          <div className="text-lg font-bold text-budget-expense">{totalExpenses.toFixed(2)} €</div>
        </CardContent>
      </Card>
      <Card className="p-2 sm:col-span-2 lg:col-span-1">
        <CardContent className="flex items-center justify-between p-2">
          <CardTitle className="text-sm font-medium">Solde</CardTitle>
          <div className="flex items-center">
            <span className={`text-lg font-bold ${balance >= 0 ? "text-budget-income" : "text-budget-expense"}`}>
              {Math.abs(balance).toFixed(2)} €
            </span>
            <span className="text-xs font-normal text-gray-500 ml-2">
              {balance >= 0 ? "Restant" : "Dépassement"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>;
};
