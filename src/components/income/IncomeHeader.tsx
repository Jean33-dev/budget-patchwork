
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Home, Clock, CreditCard, DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IncomeHeaderProps {
  title: string;
}

export const IncomeHeader = ({ title }: IncomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate("/dashboard/budget")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-background z-50">
          <DropdownMenuItem onClick={() => navigate("/dashboard/budget")} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Tableau de Bord</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/budget/budgets")} className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Gérer les Budgets</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/budget/expenses")} className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Gérer les Dépenses</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/budget/income")} className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Gérer les Revenus</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/budget/categories")} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Gérer les Catégories</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <h1 className="text-xl">{title}</h1>
    </div>
  );
};
