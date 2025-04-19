
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeftCircle,
  CreditCard,
  DollarSign,
  Home,
  Menu,
  PieChart,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardNavigationProps {
  dashboardId: string;
  onBack?: () => void;
}

export function DashboardNavigation({ dashboardId, onBack }: DashboardNavigationProps) {
  return (
    <div className="flex items-center gap-4 py-2">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0">
          <ChevronLeftCircle className="h-5 w-5" />
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/${dashboardId}`} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Tableau de Bord</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/${dashboardId}/budgets`} className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Gérer les Budgets</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/${dashboardId}/expenses`} className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Gérer les Dépenses</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/${dashboardId}/income`} className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Gérer les Revenus</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/${dashboardId}/categories`} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Gérer les Catégories</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <h1 className="text-xl font-semibold">Gestion de Budget</h1>
    </div>
  );
}
