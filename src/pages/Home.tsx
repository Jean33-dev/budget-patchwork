
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LineChart, Settings, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { EditDashboardDialog } from "@/components/dashboard/EditDashboardDialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { CreateDashboardDialog } from "@/components/dashboard/CreateDashboardDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      // Rediriger vers le nouveau tableau de bord
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
    // Mettre à jour la date de dernier accès
    updateDashboard({
      ...dashboard,
      lastAccessed: new Date().toISOString()
    });
    
    // Naviguer vers le dashboard
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
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement de la base de données</AlertTitle>
          <AlertDescription>
            <p className="mb-4">
              Impossible de charger ou d'initialiser la base de données après plusieurs tentatives.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleRetry} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleForceReload}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Rafraîchir la page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
      
      {loadAttempts > 1 && loadAttempts < MAX_LOAD_ATTEMPTS && !error && (
        <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-300">
          <AlertTitle className="text-amber-800">Tentative de reconnexion</AlertTitle>
          <AlertDescription className="text-amber-700">
            Tentative {loadAttempts}/{MAX_LOAD_ATTEMPTS} de connexion à la base de données...
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Afficher des squelettes pendant le chargement
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Afficher les tableaux de bord
          dashboards.map(dashboard => (
            <Card 
              key={dashboard.id}
              className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleDashboardClick(dashboard)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-6 w-6" />
                    {dashboard.title}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8" 
                      onClick={(e) => handleEditDashboard(dashboard, e)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    {dashboards.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive" 
                        onClick={(e) => handleDeleteDashboard(dashboard, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Créé le {new Date(dashboard.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {!isLoading && dashboards.length === 0 && (
          <Card className="col-span-full bg-muted/40">
            <CardHeader>
              <CardTitle className="text-center">Aucun tableau de bord</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore de tableau de bord. Créez-en un pour commencer.
              </p>
              <Button onClick={handleCreateDashboard}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer un tableau de bord
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && dashboards.length > 0 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6" />
                Nouveau Tableau de Bord
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handleCreateDashboard}>
                Créer
              </Button>
            </CardContent>
          </Card>
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
