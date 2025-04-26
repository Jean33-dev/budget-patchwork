
import { useState } from "react";
import { useDashboardManagement } from "@/hooks/useDashboardManagement";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { CreateDashboardCard } from "@/components/dashboard/CreateDashboardCard";
import { CreateDashboardDialog } from "@/components/dashboard/CreateDashboardDialog";
import { EditDashboardDialog } from "@/components/dashboard/EditDashboardDialog";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { DashboardGridErrorBoundary } from "@/components/dashboard/DashboardGridErrorBoundary";
import { DashboardCardSkeleton } from "@/components/dashboard/DashboardCardSkeleton";

const Home = () => {
  const { dashboards, isLoading, createDashboard, updateDashboard, deleteDashboard } = useDashboardManagement();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState<{id: string, title: string} | null>(null);

  const handleEditDashboard = (id: string, currentTitle: string) => {
    setCurrentDashboard({ id, title: currentTitle });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDashboard = async (newTitle: string) => {
    if (!currentDashboard) return;
    await updateDashboard(currentDashboard.id, newTitle);
    setIsEditDialogOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
        
        <DashboardGridErrorBoundary>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Show 3 skeleton cards while loading
              [...Array(3)].map((_, index) => (
                <DashboardCardSkeleton key={index} />
              ))
            ) : dashboards.length > 0 ? (
              dashboards.map((dashboard) => (
                <DashboardCard
                  key={dashboard.id}
                  id={dashboard.id}
                  title={dashboard.title}
                  onEdit={handleEditDashboard}
                  onDelete={deleteDashboard}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aucun tableau de bord trouvé. Créez votre premier tableau de bord!
              </div>
            )}

            <CreateDashboardCard onClick={() => setIsCreateDialogOpen(true)} />
          </div>
        </DashboardGridErrorBoundary>

        <CreateDashboardDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSave={createDashboard}
        />

        {currentDashboard && (
          <EditDashboardDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            currentName={currentDashboard.title}
            onSave={handleUpdateDashboard}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Home;
