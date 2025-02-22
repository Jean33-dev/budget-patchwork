
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnvelopeCardProps {
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  carriedOver?: number;
  onClick?: () => void;
  onViewExpenses?: () => void;
}

export const EnvelopeCard = ({ 
  title, 
  budget = 0, 
  spent = 0, 
  type, 
  carriedOver = 0,
  onClick,
  onViewExpenses 
}: EnvelopeCardProps) => {
  // Assurons-nous que les valeurs sont des nombres valides
  const safeSpent = Number(spent) || 0;
  const safeBudget = Number(budget) || 0;
  const safeCarriedOver = Number(carriedOver) || 0;
  
  const totalBudget = safeBudget + safeCarriedOver;
  const progress = totalBudget > 0 ? (safeSpent / totalBudget) * 100 : 0;
  const remaining = totalBudget - safeSpent;
  const isOverBudget = remaining < 0;

  if (type === "income") {
    return (
      <Card 
        className="transition-all hover:shadow-lg cursor-pointer hover:border-budget-income"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-budget-income">
            {safeBudget.toFixed(2)} €
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "expense") {
    return (
      <Card 
        className="transition-all hover:shadow-lg cursor-pointer hover:border-budget-expense"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-budget-expense">
            {safeSpent.toFixed(2)} €
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all hover:shadow-lg hover:border-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onClick}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onViewExpenses}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Budget : {safeBudget.toFixed(2)} €</span>
            <span>Dépensé : {safeSpent.toFixed(2)} €</span>
          </div>
          <Progress 
            value={Math.min(progress, 100)} 
            className={cn(
              "h-2",
              isOverBudget ? "bg-red-200" : "bg-gray-200",
              "text-blue-500"
            )}
          />
          <div className="flex flex-col gap-1">
            {safeCarriedOver > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Report : {safeCarriedOver.toFixed(2)} €</span>
                <span>Total : {totalBudget.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-end">
              <span className={cn(
                "text-sm font-medium",
                isOverBudget ? "text-budget-expense" : "text-budget-income"
              )}>
                {Math.abs(remaining).toFixed(2)} € {isOverBudget ? "dépassé" : "restant"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
