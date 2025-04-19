
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Income } from "@/services/database/models/income";
import { cn } from "@/lib/utils";

interface RecurringIncomeCardProps {
  income: Income;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export const RecurringIncomeCard = ({ income, onDelete, onClick }: RecurringIncomeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all" onClick={onClick}>
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="flex justify-between items-start gap-2">
          <span 
            className={cn(
              "text-base leading-tight break-words",
              income.title.length > 20 ? "line-clamp-2 hover:line-clamp-none" : ""
            )}
            title={income.title}
          >
            {income.title}
          </span>
          <span className="text-lg font-semibold whitespace-nowrap shrink-0">{income.budget.toFixed(2)} €</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 shrink-0" />
            {income.date}
          </div>
          <div>Revenu récurrent</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(income.id);
          }}
        >
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
