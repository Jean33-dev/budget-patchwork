
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ExpensesHeaderProps {
  onNavigate: (path: string) => void;
}

export const ExpensesHeader = ({ onNavigate }: ExpensesHeaderProps) => {
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-6 border-b border-t-0 border-r-0 border-l-0">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full shadow-sm hover:shadow-md hover:bg-primary/10 transition-all"
        onClick={() => onNavigate("/dashboard/budget/budgets")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Gestion des Dépenses
        </h1>
        <p className="text-sm text-muted-foreground">
          Suivez et gérez vos dépenses
        </p>
      </div>
    </div>
  );
};
