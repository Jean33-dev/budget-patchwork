
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BudgetsHeaderProps {
  onNavigate: (path: string) => void;
}

export const BudgetsHeader = ({ onNavigate }: BudgetsHeaderProps) => {
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
      <Button variant="outline" size="icon" onClick={() => onNavigate("/dashboard/budget")}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget")}>
            Tableau de Bord
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/income")}>
            Gérer les Revenus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/categories")}>
            Gérer les Catégories
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/budgets")}>
            Gérer les Budgets
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/expenses")}>
            Gérer les Dépenses
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <h1 className="text-xl">Gestion des Budgets</h1>
    </div>
  );
};
