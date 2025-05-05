
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className="shadow-md border border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          <div className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">Revenus Totaux</h3>
            </div>
            <div className="text-lg font-semibold text-green-500">
              {totalIncome.toFixed(2)} €
            </div>
          </div>
          
          <div className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                <ArrowDownRight className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">Dépenses Totales</h3>
            </div>
            <div className="text-lg font-semibold text-red-500">
              {totalExpenses.toFixed(2)} €
            </div>
          </div>
          
          <div className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">Solde</h3>
            </div>
            <div className={cn(
              "text-lg font-semibold",
              balance >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {balance >= 0 ? balance.toFixed(2) : `-${Math.abs(balance).toFixed(2)}`} €
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
