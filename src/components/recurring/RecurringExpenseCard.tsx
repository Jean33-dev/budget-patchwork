
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/utils/format-amount";
import { Trash2 } from "lucide-react";
import { Expense } from "@/services/database/models/expense";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RecurringExpenseCardProps {
  expense: Expense;
  budgetName: string;
  onDelete: () => void;
  onEdit: () => void;
  currentDate: string;
}

export const RecurringExpenseCard = ({
  expense,
  budgetName,
  onDelete,
  onEdit,
  currentDate
}: RecurringExpenseCardProps) => {
  // Format the date nicely for display
  const formattedDate = expense.date ? 
    format(new Date(expense.date), "MMMM yyyy", { locale: fr }) : 
    "Date inconnue";

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow border-t-4 border-t-red-500">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-lg font-medium line-clamp-2" title={expense.title}>
          {expense.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Montant:</span>
            <span className="font-medium text-red-600">{formatAmount(expense.budget)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Budget associé:</span>
            <span className="font-medium">{budgetName || "Aucun"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Date:</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 justify-end pt-3 pb-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:bg-red-50 hover:text-red-600" 
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
