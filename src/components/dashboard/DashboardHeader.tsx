
import { useNavigate } from "react-router-dom";
import { DashboardNavigation } from "./DashboardNavigation";

interface DashboardHeaderProps {
  dashboardId: string;
  title?: string;
}

export function DashboardHeader({ dashboardId, title }: DashboardHeaderProps) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/");
  };
  
  return (
    <header className="sticky top-0 z-10 bg-background border-b pb-2 mb-4">
      <DashboardNavigation dashboardId={dashboardId} onBack={handleBack} />
      {title && <h2 className="text-lg font-medium mt-2">{title}</h2>}
    </header>
  );
}
