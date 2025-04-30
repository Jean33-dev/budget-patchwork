
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

  return (
    <Card 
      className="cursor-pointer h-full flex flex-col hover:shadow-md transition-shadow"
      onClick={() => onEnvelopeClick({ id, title, budget, spent, type, carriedOver })}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-base font-medium">
          <span className="truncate pr-2">{title}</span>
          <Badge className={getBadgeColor()}>
            {type === "budget" ? "Budget" : type === "income" ? "Revenu" : "Dépense"}
          </Badge>
        </CardTitle>
        
        {/* Nouvelle section qui affiche clairement le budget, le report et le disponible */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Budgété:</div>
            <div className="text-sm font-medium">{formatAmount(budget)}</div>
            
            <div className="text-xs text-muted-foreground mt-1">Report:</div>
            <div className="text-sm font-medium">{formatAmount(carriedOver)}</div>
            
            <div className="text-xs text-muted-foreground mt-1">Disponible:</div>
            <div className="text-sm font-medium text-blue-600">{formatAmount(remaining)}</div>
          </div>
          
          <div className="flex flex-col items-end justify-center">
            <div className="text-xs text-muted-foreground">Dépenses:</div>
            <div className="text-lg font-semibold">{formatAmount(spent)}</div>
            <div className="text-xs text-muted-foreground mt-1">sur</div>
            <div className="text-base font-medium">{formatAmount(totalBudget)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <Progress
          value={progress > 100 ? 100 : progress}
          className={`h-2 ${progress > 90 ? "bg-red-200" : "bg-gray-200"}`}
        />
      </CardContent>
      <CardFooter className="pt-2 pb-2 gap-2 justify-end">
        {onViewExpenses && type === "budget" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewExpenses}
            className="h-8 text-xs"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Voir dépenses
          </Button>
        )}
        {onDeleteEnvelope && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
