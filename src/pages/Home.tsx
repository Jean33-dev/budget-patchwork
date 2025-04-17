
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDashboards } from "@/hooks/useDashboards";
import { Dashboard } from "@/services/database/models/dashboard";
import { DashboardDialogs } from "@/components/home/DashboardDialogs";
import { DashboardGrid } from "@/components/home/DashboardGrid";
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

      <DashboardGrid
        isLoading={isLoading}
        dashboards={dashboards}
        onEdit={handleEditDashboard}
        onDelete={handleDeleteDashboard}
        onClick={handleDashboardClick}
        onCreateClick={handleCreateDashboard}
      />

      <DashboardDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedDashboard={selectedDashboard}
        handleCreateNewDashboard={handleCreateNewDashboard}
        handleSaveDashboardName={handleSaveDashboardName}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Home;
