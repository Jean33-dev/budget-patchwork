
import { useNavigate, useParams } from "react-router-dom";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

interface ExpensesHeaderProps {
  onNavigate?: (path: string) => void;
}

export const ExpensesHeader = ({ onNavigate }: ExpensesHeaderProps) => {
  const navigate = useNavigate();
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();
  
  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
      <DashboardNavigation 
        dashboardId={dashboardId} 
        onBack={() => handleNavigate(`/dashboard/${dashboardId}/budgets`)} 
      />
      <h1 className="text-xl mt-2">Gestion des Dépenses</h1>
    </div>
  );
};
