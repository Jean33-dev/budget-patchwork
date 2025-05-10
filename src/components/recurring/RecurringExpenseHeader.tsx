
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface RecurringExpenseHeaderProps {
  onAdd: () => void;
}

export const RecurringExpenseHeader = ({ onAdd }: RecurringExpenseHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1">
        {/* Title removed from here */}
      </div>
      <Button onClick={onAdd} variant="default">
        <PlusCircle className="h-4 w-4 mr-2" />
        Ajouter
      </Button>
    </div>
  );
};
