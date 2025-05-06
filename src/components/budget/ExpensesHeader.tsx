
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ExpensesHeaderProps {
  onNavigate: (path: string) => void;
}

export const ExpensesHeader = ({ onNavigate }: ExpensesHeaderProps) => {
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-4 border-b">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full shadow-sm hover:shadow transition-all"
        onClick={() => onNavigate("/dashboard/budget/budgets")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="text-xl font-semibold">Gestion des Dépenses</h1>
    </div>
  );
};
