
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, PencilIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/utils/format-amount";
import { Budget } from "@/types/categories";

interface EnvelopeCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
  onClick?: (budget: Budget) => void;
  className?: string;
  showActions?: boolean;
}

export const EnvelopeCard = ({
  budget,
  onEdit,
  onDelete,
  onClick,
  className,
  showActions = true
}: EnvelopeCardProps) => {
  const { title, budget: amount, spent = 0 } = budget;
  const remaining = amount - spent;
  const isOverBudget = remaining < 0;

  const handleCardClick = () => {
    if (onClick) onClick(budget);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border-t-4 hover:shadow-md transition-all", 
        isOverBudget ? "border-t-red-500" : "border-t-green-500",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick ? handleCardClick : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {showActions && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(budget);
                  }}>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                )}
                {onEdit && onDelete && <DropdownMenuSeparator />}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(budget);
                    }}
                    className="text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="flex justify-between items-baseline text-sm">
            <span className="font-medium text-muted-foreground">Budget</span>
            <span className="font-semibold">{formatAmount(amount)}</span>
          </div>
          <div className="flex justify-between items-baseline text-sm">
            <span className="font-medium text-muted-foreground">Dépensé</span>
            <span className="font-semibold">{formatAmount(spent)}</span>
          </div>
          <div className="flex justify-between items-baseline text-sm">
            <span className="font-medium text-muted-foreground">Restant</span>
            <span className={cn(
              "font-semibold",
              isOverBudget ? "text-red-500" : "text-green-500"
            )}>
              {formatAmount(remaining)}
            </span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
            <div 
              className={cn(
                "h-1 rounded-full",
                isOverBudget ? "bg-red-500" : "bg-green-500"
              )} 
              style={{ 
                width: `${Math.min(100, (spent / amount) * 100)}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
