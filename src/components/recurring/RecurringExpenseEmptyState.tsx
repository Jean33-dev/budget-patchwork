
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface RecurringExpenseEmptyStateProps {
  onAddClick: () => void;
}

export const RecurringExpenseEmptyState = ({ onAddClick }: RecurringExpenseEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Aucune dépense récurrente trouvée</p>
      <Button onClick={onAddClick} variant="outline" className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" />
        Ajouter une dépense récurrente
      </Button>
    </div>
  );
};
