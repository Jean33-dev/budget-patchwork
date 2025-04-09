
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Expense } from "@/services/database/models/expense";
import { Calendar, Plus, Wallet } from "lucide-react";

interface RecurringExpenseCardProps {
  expense: Expense;
  getBudgetName: (budgetId?: string) => string;
  onDelete: (id: string) => void;
  onAddToCurrentMonth: (id: string) => void;
  currentDate: string;
}

export const RecurringExpenseCard = ({
  expense,
  getBudgetName,
  onDelete,
  onAddToCurrentMonth,
  currentDate,
}: RecurringExpenseCardProps) => {
  return (
    <Card key={expense.id} className="overflow-hidden">
      <CardHeader className="bg-destructive/5 pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{expense.title}</span>
          <span className="text-lg font-semibold">{expense.budget.toFixed(2)} €</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {expense.date}
          </div>
          <div className="flex items-center">
            <Wallet className="h-4 w-4 mr-1" />
            {getBudgetName(expense.linkedBudgetId)}
          </div>
          <div>Dépense récurrente</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(expense.id)}
        >
          Supprimer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddToCurrentMonth(expense.id)}
        >
          <Plus className="h-4 w-4 mr-1" /> Ajouter au mois
        </Button>
      </CardFooter>
    </Card>
  );
};
