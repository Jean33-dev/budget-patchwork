
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { useDashboards } from "@/hooks/useDashboards";

const Dashboard = () => {
  const { dashboardId = "budget" } = useParams();
  const navigate = useNavigate();
  const { dashboards } = useDashboards();
  const [title, setTitle] = useState("Budget Personnel");
  const [isDefaultDashboard, setIsDefaultDashboard] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Déterminer le titre du tableau de bord en fonction de l'ID
  useEffect(() => {
    if (dashboardId === "budget") {
      setTitle("Budget Personnel");
      setIsDefaultDashboard(true);
    } else {
      // Rechercher le tableau de bord personnalisé
      const dashboard = dashboards.find(d => d.id === dashboardId);
      if (dashboard) {
        setTitle(dashboard.title);
        setIsDefaultDashboard(false);
      } else {
        // Si le tableau de bord n'existe pas, rediriger vers la page d'accueil
        console.log("Dashboard not found, redirecting to home page");
        navigate("/");
      }
    }
  }, [dashboardId, dashboards, navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
    // Add any additional logic needed for month changes
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <DashboardHeader 
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        onBackClick={handleBackClick}
      />
      <DashboardOverview 
        dashboardId={dashboardId}
        isDefaultDashboard={isDefaultDashboard}
      />
    </div>
  );
};

export default Dashboard;
