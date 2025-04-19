
import React from 'react';
import { useDashboards } from "@/hooks/useDashboards";
import { useDashboardActions } from "@/hooks/useDashboardActions";
import { DashboardDialogs } from "@/components/home/DashboardDialogs";
import { DashboardGrid } from "@/components/home/DashboardGrid";
import { DatabaseErrorAlert } from "@/components/home/DatabaseErrorAlert";
import { ReconnectionAlert } from "@/components/home/ReconnectionAlert";

const Home = () => {
  const {
    dashboards,
    isLoading,
    error,
    retryLoadDashboards,
    loadAttempts,
    MAX_LOAD_ATTEMPTS
  } = useDashboards();

  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedDashboard,
    handleCreateDashboard,
    handleEditDashboard,
    handleDeleteDashboard,
    handleSaveDashboardName,
    handleCreateNewDashboard,
    handleConfirmDelete,
    handleDashboardClick,
  } = useDashboardActions();

  const handleRetry = async () => {
    await retryLoadDashboards();
  };

  const handleForceReload = () => {
    window.location.reload();
  };

  // Si erreur pendant le chargement, afficher l'alerte d'erreur
  if (error || loadAttempts > MAX_LOAD_ATTEMPTS) {
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

      {/* Afficher l'alerte de reconnexion seulement si des tentatives sont en cours */}
      {loadAttempts > 1 && loadAttempts <= MAX_LOAD_ATTEMPTS && !error && (
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
