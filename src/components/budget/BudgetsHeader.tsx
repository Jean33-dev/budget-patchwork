
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BudgetsHeaderProps {
  onNavigate: (path: string) => void;
}

export const BudgetsHeader = ({ onNavigate }: BudgetsHeaderProps) => {
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
      <Button variant="outline" size="icon" onClick={() => onNavigate("/dashboard/budget")}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="text-xl">Gestion des Budgets</h1>
    </div>
  );
};
