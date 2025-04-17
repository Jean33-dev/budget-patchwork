import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDashboards } from "@/hooks/useDashboards";
import { Dashboard } from "@/services/database/models/dashboard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateDashboardDialog } from "@/components/dashboard/CreateDashboardDialog";
import { EditDashboardDialog } from "@/components/dashboard/EditDashboardDialog";
import { DashboardCard } from "@/components/home/DashboardCard";
import { CreateDashboardCard } from "@/components/home/CreateDashboardCard";
import { EmptyDashboardCard } from "@/components/home/EmptyDashboardCard";
import { LoadingDashboardCard } from "@/components/home/LoadingDashboardCard";
import { DatabaseErrorAlert } from "@/components/home/DatabaseErrorAlert";
import { ReconnectionAlert } from "@/components/home/ReconnectionAlert";

const Home = () => {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  const {
    dashboards,
    isLoading,
    error,
    addDashboard,
    updateDashboard,
    deleteDashboard,
    retryLoadDashboards,
    loadAttempts,
    MAX_LOAD_ATTEMPTS
  } = useDashboards();

  const handleCreateDashboard = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditDashboard = (dashboard: Dashboard, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDashboard(dashboard);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDashboard = (dashboard: Dashboard, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDashboard(dashboard);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveDashboardName = async (newName: string) => {
    if (selectedDashboard) {
      const success = await updateDashboard({
        ...selectedDashboard,
        title: newName
      });
      
      if (success) {
        setIsEditDialogOpen(false);
        setSelectedDashboard(null);
      }
    }
  };

  const handleCreateNewDashboard = async (name: string) => {
    const dashboardId = await addDashboard(name);
    setIsCreateDialogOpen(false);
    
    if (dashboardId) {
      navigate(`/dashboard/${dashboardId}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDashboard) {
      const success = await deleteDashboard(selectedDashboard.id);
      
      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedDashboard(null);
      }
    }
  };

  const handleDashboardClick = (dashboard: Dashboard) => {
    updateDashboard({
      ...dashboard,
      lastAccessed: new Date().toISOString()
    });
    
    navigate(`/dashboard/${dashboard.id}`);
  };

  const handleRetry = async () => {
    await retryLoadDashboards();
  };

  const handleForceReload = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
        <DatabaseErrorAlert
          onRetry={handleRetry}
          onForceReload={handleForceReload}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>

      {loadAttempts > 1 && loadAttempts < MAX_LOAD_ATTEMPTS && !error && (
        <ReconnectionAlert
          attempts={loadAttempts}
          maxAttempts={MAX_LOAD_ATTEMPTS}
        />
      )}

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
                onEdit={handleEditDashboard}
                onDelete={handleDeleteDashboard}
                onClick={handleDashboardClick}
                canDelete={dashboards.length > 1}
              />
            ))}

            {dashboards.length === 0 ? (
              <EmptyDashboardCard onClick={handleCreateDashboard} />
            ) : (
              <CreateDashboardCard onClick={handleCreateDashboard} />
            )}
          </>
        )}
      </div>

      <EditDashboardDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentName={selectedDashboard?.title || ""}
        onSave={handleSaveDashboardName}
      />

      <CreateDashboardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreateNewDashboard}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce tableau de bord ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce tableau de bord seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Home;
