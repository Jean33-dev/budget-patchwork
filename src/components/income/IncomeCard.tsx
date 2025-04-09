
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Income } from "@/services/database/models/income";

interface IncomeCardProps {
  income: Income;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export const IncomeCard = ({ income, onDelete, onClick }: IncomeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all" onClick={onClick}>
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{income.title}</span>
          <span className="text-lg font-semibold">{income.budget.toFixed(2)} €</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {income.date}
          </div>
          <div>{income.isRecurring ? "Revenu récurrent" : "Revenu ponctuel"}</div>
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
