import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface EnvelopeCardProps {
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  onClick?: () => void;
}

export const EnvelopeCard = ({ title, budget, spent, type, onClick }: EnvelopeCardProps) => {
  const progress = (spent / budget) * 100;
  const remaining = budget - spent;
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
            {budget.toFixed(2)} €
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-lg cursor-pointer",
        type === "expense" ? "hover:border-budget-expense" : "hover:border-blue-500"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Budget : {budget.toFixed(2)} €</span>
            <span>Dépensé : {spent.toFixed(2)} €</span>
          </div>
          <Progress 
            value={Math.min(progress, 100)} 
            className={cn(
              "h-2",
              isOverBudget ? "bg-red-200" : "bg-gray-200",
              type === "expense" ? "text-budget-expense" : "text-blue-500"
            )}
          />
          <div className="flex justify-end">
            <span className={cn(
              "text-sm font-medium",
              isOverBudget ? "text-budget-expense" : "text-budget-income"
            )}>
              {Math.abs(remaining).toFixed(2)} € {isOverBudget ? "dépassé" : "restant"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};