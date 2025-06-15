
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/utils/format-amount";
import { useTheme } from "@/context/ThemeContext";

interface EnvelopeCardProps {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: string;
  carriedOver?: number; // Montant reporté du mois précédent
  onEnvelopeClick: (envelope: any) => void;
  onViewExpenses?: (envelope: any) => void;
  onDeleteEnvelope?: (id: string) => void;
  currency?: "EUR" | "USD" | "GBP";
}

export const EnvelopeCard = ({
  id,
  title,
  budget,
  spent,
  type,
  carriedOver = 0,
  onEnvelopeClick,
  onViewExpenses,
  onDeleteEnvelope,
  currency,
}: EnvelopeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTheme();

  // Calculer le pourcentage d'avancement avec le montant reporté
  const totalBudget = budget + carriedOver;
  const progressRaw = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  const remaining = totalBudget - spent;
  const isOverBudget = remaining < 0;

  // Progress doit être 100% si on est dans le négatif (dépassement)
  const progress = isOverBudget ? 100 : progressRaw;

  // Couleur du badge pour les types
  const getBadgeColor = () => {
    switch (type) {
      case "budget":
        return "bg-blue-500 hover:bg-blue-600";
      case "income":
        return "bg-green-500 hover:bg-green-600";
      case "expense":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getBadgeText = () => {
    if (type === "budget") return t("budgetCard.badgeBudget");
    if (type === "income") return t("budgetCard.badgeIncome");
    if (type === "expense") return t("budgetCard.badgeExpense");
    return t("budgetCard.badgeDefault");
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteEnvelope) {
      onDeleteEnvelope(id);
    }
  };
  
  const handleViewExpenses = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewExpenses) {
      onViewExpenses({ id, title, budget, spent, type, carriedOver });
    }
  };

  // Déterminer la couleur de fond du budget en fonction du progrès
  const getProgressColor = () => {
    if (progress > 95) return "bg-red-100 [&>div]:bg-red-500";
    if (progress > 75) return "bg-orange-100 [&>div]:bg-orange-500";
    return "bg-blue-100 [&>div]:bg-blue-500";
  };

  // Déterminer la couleur du texte pour le montant restant
  const getRemainingColor = () => {
    if (isOverBudget) return "text-red-600 font-bold";
    if (remaining < totalBudget * 0.25) return "text-orange-600";
    return "text-blue-600";
  };

  return (
    <Card 
      className="cursor-pointer h-full flex flex-col hover:shadow-md transition-shadow border-t-4"
      style={{ borderTopColor: isOverBudget ? '#ef4444' : (type === "income" ? '#10b981' : '#3b82f6') }}
      onClick={() => onEnvelopeClick({ id, title, budget, spent, type, carriedOver })}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {title}
          </CardTitle>
          <Badge className={`${getBadgeColor()} ml-2 shrink-0`}>
            {getBadgeText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("budgetCard.budgeted")}</span>
              <span className="text-sm font-medium">{formatAmount(budget, currency)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("budgetCard.available")}</span>
              <span className={`text-sm font-medium ${getRemainingColor()}`}>
                {formatAmount(remaining, currency)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-center">
            <span className="text-xs text-gray-500 text-right">{t("budgetCard.spent")}</span>
            <span className="text-xl font-bold">{formatAmount(spent, currency)}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-sm">{formatAmount(spent, currency)}/{formatAmount(totalBudget, currency)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">{t("budgetCard.progression")}</span>
            <span className={isOverBudget ? "text-red-600 font-medium" : "text-gray-600"}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={progress}
            className={`h-2 ${getProgressColor()}`}
          />
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 gap-2 flex justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">{t("budgetCard.carriedOver")}</span>
          <span className="text-sm font-medium">{formatAmount(carriedOver, currency)}</span>
        </div>
        
        <div className="flex gap-2 justify-end">
          {onViewExpenses && type === "budget" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewExpenses}
              className="h-8 text-xs bg-white hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              {t("budgetCard.viewExpenses")}
            </Button>
          )}
          {onDeleteEnvelope && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

