
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface RecurringExpenseHeaderProps {
  onAdd: () => void;
}

export const RecurringExpenseHeader = ({ onAdd }: RecurringExpenseHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Dépenses Récurrentes</h1>
      <Button onClick={onAdd} variant="default">
        <PlusCircle className="h-4 w-4 mr-2" />
        Ajouter
      </Button>
    </div>
  );
};
