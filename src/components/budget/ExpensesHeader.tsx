
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ExpensesHeaderProps {
  onNavigate: (path: string) => void;
}

export const ExpensesHeader = ({ onNavigate }: ExpensesHeaderProps) => {
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 pb-4 border-b border-border/50">
      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full hover:bg-secondary/80"
        onClick={() => onNavigate("/dashboard/budget/budgets")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="text-xl font-semibold text-gradient">Gestion des Dépenses</h1>
    </div>
  );
};
