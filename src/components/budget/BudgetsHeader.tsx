
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BudgetsHeaderProps {
  onNavigate: (path: string) => void;
}

export const BudgetsHeader = ({ onNavigate }: BudgetsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-1">Gestion des budgets</h1>
        <p className="text-sm text-muted-foreground">
          Configurez vos budgets mensuels et suivez vos dépenses
        </p>
      </div>
      <Button variant="outline" size="icon" onClick={() => onNavigate("/dashboard/budget")}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};
