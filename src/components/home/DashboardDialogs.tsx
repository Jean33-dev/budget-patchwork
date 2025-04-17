
import { useState } from "react";
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

interface DashboardDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedDashboard: Dashboard | null;
  handleCreateNewDashboard: (name: string) => Promise<void>;
  handleSaveDashboardName: (newName: string) => Promise<void>;
  handleConfirmDelete: () => Promise<void>;
}

export const DashboardDialogs = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedDashboard,
  handleCreateNewDashboard,
  handleSaveDashboardName,
  handleConfirmDelete,
}: DashboardDialogsProps) => {
  return (
    <>
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
    </>
  );
};
