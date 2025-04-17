
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "@/services/database/models/dashboard";
import { useDashboards } from "@/hooks/useDashboards";

export function useDashboardActions() {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  const {
    addDashboard,
    updateDashboard,
    deleteDashboard,
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

  return {
    // Dialog states
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedDashboard,
    // Action handlers
    handleCreateDashboard,
    handleEditDashboard,
    handleDeleteDashboard,
    handleSaveDashboardName,
    handleCreateNewDashboard,
    handleConfirmDelete,
    handleDashboardClick,
  };
}
