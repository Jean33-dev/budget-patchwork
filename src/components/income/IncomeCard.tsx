
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2 } from "lucide-react";
import { Income } from "@/services/database/models/income";
import { cn } from "@/lib/utils";

interface IncomeCardProps {
  income: Income;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export const IncomeCard = ({ income, onDelete, onClick }: IncomeCardProps) => {
  return (
    <Card 
      className="overflow-hidden card-hover cursor-pointer border border-border/50" 
      onClick={onClick}
    >
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="flex justify-between items-center gap-2">
          <span 
            className={cn(
              "text-base leading-tight break-words my-auto",
              income.title.length > 20 ? "line-clamp-2 hover:line-clamp-none" : ""
            )}
            title={income.title}
          >
            {income.title}
          </span>
          <span className="text-lg font-semibold whitespace-nowrap shrink-0 text-primary">
            {income.budget.toFixed(2)} €
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 shrink-0" />
            {income.date}
          </div>
          <div className="bg-secondary/30 px-2 py-0.5 rounded-full text-xs">
            {income.isRecurring ? "Récurrent" : "Ponctuel"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-border/50 pt-3 bg-secondary/10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(income.id);
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
