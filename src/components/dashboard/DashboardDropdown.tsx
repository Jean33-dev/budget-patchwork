
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dashboard } from "@/services/database/models/dashboard";

interface DashboardDropdownProps {
  title: string;
  isLoading: boolean;
  dashboards: Dashboard[];
  currentDashboardId: string;
  onEditClick: () => void;
}

export const DashboardDropdown = ({
  title,
  isLoading,
  dashboards,
  currentDashboardId,
  onEditClick
}: DashboardDropdownProps) => {
  const navigate = useNavigate();

  const switchToDashboard = (dashboardId: string) => {
    navigate(`/dashboard/${dashboardId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
          <span className="text-xl font-normal">
            {isLoading ? "Chargement..." : `Tableau de bord ${title}`}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {dashboards.map(dashboard => (
          <DropdownMenuItem
            key={dashboard.id}
            onClick={() => switchToDashboard(dashboard.id)}
            className={currentDashboardId === dashboard.id ? "bg-accent" : ""}
          >
            {dashboard.title}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={onEditClick}>
          Modifier le titre
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
