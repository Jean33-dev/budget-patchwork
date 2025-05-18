
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/utils/format-amount";
import { Edit, Trash2, CalendarCheck } from "lucide-react";
import { Expense } from "@/services/database/models/expense";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { db } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(expense.isActiveForCurrentMonth || false);

  const handleToggleActive = async () => {
    try {
      const newIsActive = !isActive;
      setIsActive(newIsActive);
      
      // Mettre à jour l'expense localement
      const updatedExpense: Expense = {
        ...expense,
        isActiveForCurrentMonth: newIsActive
      };
      
      // Mettre à jour dans la base de données
      await db.updateExpense(updatedExpense);
      
      // Si activé, l'ajouter pour le mois courant
      if (newIsActive) {
        // Convertir la date actuelle au format YYYY-MM
        const targetMonth = currentDate.substring(0, 7);
        await db.copyRecurringExpenseToMonth(expense.id, currentDate);
        
        toast({
          description: `La dépense "${expense.title}" sera prise en compte pour le mois en cours.`
        });
      } else {
        toast({
          description: `La dépense "${expense.title}" ne sera pas prise en compte pour le mois en cours.`
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la dépense récurrente"
      });
      setIsActive(!isActive); // Revenir à l'état précédent
    }
  };

  // Format the date nicely for display
  const formattedDate = expense.date ? 
    format(new Date(expense.date), "MMMM yyyy", { locale: fr }) : 
    "Date inconnue";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{expense.title}</CardTitle>
          <div className="flex items-center">
            <Checkbox 
              id={`active-${expense.id}`}
              checked={isActive}
              onCheckedChange={handleToggleActive}
              className="mr-2"
            />
            <label 
              htmlFor={`active-${expense.id}`}
              className="text-sm text-gray-600 cursor-pointer"
            >
              Ce mois
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Montant:</span>
            <span className="font-medium">{formatAmount(expense.budget)}</span>
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
      <CardFooter className="bg-gray-50 gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        <Button variant="outline" size="sm" className="text-red-500" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
