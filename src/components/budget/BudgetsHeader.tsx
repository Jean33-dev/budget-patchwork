
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ExportImportButtons } from "../shared/ExportImportButtons";

interface BudgetsHeaderProps {
  onNavigate: (path: string) => void;
}

export const BudgetsHeader = ({ onNavigate }: BudgetsHeaderProps) => {
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-6 border-b">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full shadow-sm hover:shadow-md hover:bg-primary/10 transition-all"
        onClick={() => onNavigate("/dashboard/budget")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Gestion des Budgets
        </h1>
        <p className="text-sm text-muted-foreground">
          Créez et gérez vos budgets mensuels
        </p>
      </div>
      
      <ExportImportButtons />
    </div>
  );
};
