
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface RecurringIncomeEmptyStateProps {
  onAddClick: () => void;
}

export const RecurringIncomeEmptyState = ({ onAddClick }: RecurringIncomeEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Aucun revenu récurrent trouvé</p>
      <Button onClick={onAddClick} variant="outline" className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" />
        Ajouter un revenu récurrent
      </Button>
    </div>
  );
};
