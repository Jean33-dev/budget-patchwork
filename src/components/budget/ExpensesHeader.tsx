
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Home, Clock, CreditCard, DollarSign, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExpensesHeaderProps {
  onNavigate: (path: string) => void;
}

export const ExpensesHeader = ({ onNavigate }: ExpensesHeaderProps) => {
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
      <Button variant="outline" size="icon" onClick={() => onNavigate("/dashboard/budget/budgets")}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-background">
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget")} className="gap-2">
            <Home className="h-4 w-4" />
            Tableau de Bord
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/budgets")} className="gap-2">
            <Clock className="h-4 w-4" />
            Gérer les Budgets
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/expenses")} className="gap-2">
            <CreditCard className="h-4 w-4" />
            Gérer les Dépenses
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/income")} className="gap-2">
            <DollarSign className="h-4 w-4" />
            Gérer les Revenus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("/dashboard/budget/categories")} className="gap-2">
            <Calendar className="h-4 w-4" />
            Gérer les Catégories
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <h1 className="text-xl">Gestion des Dépenses</h1>
    </div>
  );
};
