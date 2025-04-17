
import { Dashboard } from "@/services/database/models/dashboard";
import { DashboardCard } from "./DashboardCard";
import { CreateDashboardCard } from "./CreateDashboardCard";
import { EmptyDashboardCard } from "./EmptyDashboardCard";
import { LoadingDashboardCard } from "./LoadingDashboardCard";

interface DashboardGridProps {
  isLoading: boolean;
  dashboards: Dashboard[];
  onEdit: (dashboard: Dashboard, e: React.MouseEvent) => void;
  onDelete: (dashboard: Dashboard, e: React.MouseEvent) => void;
  onClick: (dashboard: Dashboard) => void;
  onCreateClick: () => void;
}

export const DashboardGrid = ({
  isLoading,
  dashboards,
  onEdit,
  onDelete,
  onClick,
  onCreateClick,
}: DashboardGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        Array(3).fill(0).map((_, index) => (
          <LoadingDashboardCard key={index} />
        ))
      ) : (
        <>
          {dashboards.map(dashboard => (
            <DashboardCard
              key={dashboard.id}
              dashboard={dashboard}
              onEdit={onEdit}
              onDelete={onDelete}
              onClick={onClick}
              canDelete={dashboards.length > 1}
            />
          ))}

          {dashboards.length === 0 ? (
            <EmptyDashboardCard onClick={onCreateClick} />
          ) : (
            <CreateDashboardCard onClick={onCreateClick} />
          )}
        </>
      )}
    </div>
  );
};
