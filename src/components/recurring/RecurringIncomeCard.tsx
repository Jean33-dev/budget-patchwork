
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/utils/format-amount";
import { Trash2 } from "lucide-react";
import { Income } from "@/services/database/models/income";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RecurringIncomeCardProps {
  income: Income;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export const RecurringIncomeCard = ({
  income,
  onDelete,
  onClick
}: RecurringIncomeCardProps) => {
  // Format the date nicely for display
  const formattedDate = income.date ? 
    format(new Date(income.date), "MMMM yyyy", { locale: fr }) : 
    "Date inconnue";

  return (
    <Card 
      className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow border-t-4 border-t-green-500 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-lg font-medium line-clamp-2" title={income.title}>
          {income.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Montant:</span>
            <span className="font-semibold text-green-600">{formatAmount(income.budget)}</span>
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
