
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/utils/format-amount";
import { Edit, Trash2 } from "lucide-react";
import { Income } from "@/services/database/models/income";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { db } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(income.isActiveForCurrentMonth || false);
  const currentDate = new Date().toISOString().split('T')[0];

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Éviter de déclencher le onClick du Card
    
    try {
      const newIsActive = !isActive;
      setIsActive(newIsActive);
      
      // Mettre à jour l'income localement
      const updatedIncome: Income = {
        ...income,
        isActiveForCurrentMonth: newIsActive
      };
      
      // Mettre à jour dans la base de données
      await db.updateIncome(updatedIncome);
      
      // Si activé, l'ajouter pour le mois courant
      if (newIsActive) {
        await db.copyRecurringIncomeToMonth(income.id, currentDate);
        
        toast({
          description: `Le revenu "${income.title}" sera pris en compte pour le mois en cours.`
        });
      } else {
        toast({
          description: `Le revenu "${income.title}" ne sera pas pris en compte pour le mois en cours.`
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du revenu récurrent"
      });
      setIsActive(!isActive); // Revenir à l'état précédent
    }
  };

  // Format the date nicely for display
  const formattedDate = income.date ? 
    format(new Date(income.date), "MMMM yyyy", { locale: fr }) : 
    "Date inconnue";

  return (
    <Card 
      className="overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{income.title}</CardTitle>
          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox 
              id={`active-${income.id}`}
              checked={isActive}
              onCheckedChange={() => handleToggleActive}
              className="mr-2"
            />
            <label 
              htmlFor={`active-${income.id}`}
              className="text-sm text-gray-600 cursor-pointer"
              onClick={(e) => handleToggleActive(e)}
            >
              Ce mois
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
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
      <CardFooter className="bg-gray-50 gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}>
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500" 
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
