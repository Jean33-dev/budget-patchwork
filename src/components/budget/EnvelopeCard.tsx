
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
}: EnvelopeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculer le pourcentage d'avancement avec le montant reporté
  const totalBudget = budget + carriedOver;
  const progress = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  const remaining = totalBudget - spent;
  const isOverBudget = remaining < 0;

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
            {type === "budget" ? "Budget" : type === "income" ? "Revenu" : "Dépense"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Budgété</span>
              <span className="text-sm font-medium">{formatAmount(budget)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Disponible</span>
              <span className={`text-sm font-medium ${getRemainingColor()}`}>
                {formatAmount(remaining)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-center">
            <span className="text-xs text-gray-500 text-right">Dépenses</span>
            <span className="text-xl font-bold">{formatAmount(spent)}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-sm">{formatAmount(spent)}/{formatAmount(totalBudget)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Progression</span>
            <span className={isOverBudget ? "text-red-600 font-medium" : "text-gray-600"}>
              {Math.min(progress, 100).toFixed(0)}%
            </span>
          </div>
          <Progress
            value={Math.min(progress, 100)}
            className={`h-2 ${getProgressColor()}`}
          />
        </div>
        
        {/* Report déplacé sous la barre de progression */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Report</span>
            <span className="text-sm font-medium">{formatAmount(carriedOver)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 gap-2 justify-end">
        {onViewExpenses && type === "budget" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewExpenses}
            className="h-8 text-xs bg-white hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Voir dépenses
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
      </CardFooter>
    </Card>
  );
};
