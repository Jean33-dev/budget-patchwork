
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Home, CalendarClock, CreditCard, DollarSign, Folder } from "lucide-react";
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
        <DropdownMenuContent align="start" className="bg-white rounded-md shadow-md border-0">
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget")} className="flex items-center gap-2 py-2">
            <Home className="h-4 w-4" />
            <span>Tableau de Bord</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/budgets")} className="flex items-center gap-2 py-2">
            <CalendarClock className="h-4 w-4" />
            <span>Gérer les Budgets</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/expenses")} className="flex items-center gap-2 py-2">
            <CreditCard className="h-4 w-4" />
            <span>Gérer les Dépenses</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/income")} className="flex items-center gap-2 py-2">
            <DollarSign className="h-4 w-4" />
            <span>Gérer les Revenus</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/categories")} className="flex items-center gap-2 py-2">
            <Folder className="h-4 w-4" />
            <span>Gérer les Catégories</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <h1 className="text-xl">Gestion des Budgets</h1>
    </div>
  );
};
