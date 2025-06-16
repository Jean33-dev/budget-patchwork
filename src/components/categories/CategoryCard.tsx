
import { Category } from "@/types/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { db } from "@/services/database";
import { useEffect, useState } from "react";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { useTheme } from "@/context/ThemeContext";
import { formatAmount } from "@/utils/format-amount";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  currency?: "EUR" | "USD" | "GBP";
}

export const CategoryCard = ({ category, onEdit, currency }: CategoryCardProps) => {
  const [budgetNames, setBudgetNames] = useState<string[]>([]);
  const { currentDashboardId } = useDashboardContext();
  const { currency: globalCurrency, t } = useTheme();
  const usedCurrency = currency || globalCurrency;

  useEffect(() => {
    const loadBudgetNames = async () => {
      const allBudgets = await db.getBudgets();
      
      // Filtrer les budgets par dashboardId
      const filteredBudgets = allBudgets.filter(budget => 
        String(budget.dashboardId) === String(currentDashboardId)
      );
      
      const names = category.budgets.map(budgetId => {
        const budget = filteredBudgets.find(b => b.id === budgetId);
        return budget ? budget.title : budgetId;
      });
      setBudgetNames(names);
    };

    loadBudgetNames();
  }, [category.budgets, currentDashboardId]);

  const percentage = category.total > 0 ? (category.spent / category.total) * 100 : 0;
  const isOverBudget = percentage > 100;
  const remaining = category.total - category.spent;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{category.name}</CardTitle>
            {category.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {category.description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {t("categories.card.budgetsAssigned")} : {budgetNames.length > 0 ? budgetNames.join(", ") : t("categories.card.noBudgetsAssigned")}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-semibold">{t("categories.card.totalBudget")} :</div>
            <div>{formatAmount(category.total, usedCurrency)}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-semibold">{t("categories.card.expenses")} :</div>
            <div className={isOverBudget ? "text-budget-expense" : ""}>{formatAmount(category.spent, usedCurrency)}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-semibold">{t("categories.card.remaining")} :</div>
            <div className={isOverBudget ? "text-budget-expense" : "text-budget-income"}>
              {formatAmount(remaining, usedCurrency)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{t("categories.card.progression")} :</span>
              <span className={isOverBudget ? "text-budget-expense" : ""}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(percentage, 100)} 
              className={cn(
                "h-2",
                isOverBudget ? "[&>div]:bg-budget-expense bg-red-200" : "[&>div]:bg-budget-income"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
