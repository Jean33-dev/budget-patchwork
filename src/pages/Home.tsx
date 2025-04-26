import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LineChart, Settings, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { CreateDashboardDialog } from "@/components/dashboard/CreateDashboardDialog";
import { db } from "@/services/database";
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboards, setDashboards] = useState<Array<{id: string, title: string}>>([]);

  useEffect(() => {
    const loadDashboards = async () => {
      try {
        await db.init();
        console.log("🔍 Home - Chargement des tableaux de bord...");
        const dashboardsData = await db.getDashboards();
        console.log("🔍 Home - Tableaux de bord chargés:", dashboardsData);
        setDashboards(dashboardsData);
      } catch (error) {
        console.error("🔍 Home - Erreur lors du chargement des tableaux de bord:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les tableaux de bord"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboards();
  }, [toast]);

  const handleCreateDashboard = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveDashboard = async (name: string) => {
    try {
      const newDashboardId = uuidv4();
      console.log("🔍 Home - Création d'un nouveau tableau de bord avec ID:", newDashboardId);
      
      const newDashboard = {
        id: newDashboardId,
        title: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("🔍 Home - Nouveau dashboard à créer:", newDashboard);
      
      await db.addDashboard(newDashboard);
      console.log("🔍 Home - Dashboard sauvegardé dans SQLite");
      
      const updatedDashboards = await db.getDashboards();
      setDashboards(updatedDashboards);
      
      localStorage.setItem('currentDashboardId', newDashboardId);
      
      setIsCreateDialogOpen(false);
      
      navigate(`/dashboard/${newDashboardId}`);
      
      toast({
        title: "Succès",
        description: "Le tableau de bord a été créé",
      });
    } catch (error) {
      console.error("🔍 Home - Erreur lors de la création du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le tableau de bord"
      });
      throw error;
    }
  };
  
  const handleDeleteDashboard = async (id: string) => {
    try {
      await db.deleteDashboard(id);
      const updatedDashboards = await db.getDashboards();
      setDashboards(updatedDashboards);
      toast({
        title: "Succès",
        description: "Le tableau de bord a été supprimé",
      });
    } catch (error) {
      console.error("🔍 Home - Erreur lors de la suppression du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le tableau de bord"
      });
    }
  };

  const handleEditDashboard = (id: string, currentTitle: string) => {
    toast({
      title: "Info",
      description: "Fonctionnalité de modification à venir"
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboards.length > 0 ? (
          dashboards.map((dashboard) => (
            <Card 
              key={dashboard.id}
              className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => {
                localStorage.setItem('currentDashboardId', dashboard.id);
                navigate(`/dashboard/${dashboard.id}`);
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-6 w-6" />
                    {dashboard.title}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDashboard(dashboard.id, dashboard.title);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDashboard(dashboard.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))
        ) : !isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Aucun tableau de bord trouvé. Créez votre premier tableau de bord!
          </div>
        ) : null}

        <Card 
          className="border-dashed cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleCreateDashboard}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-6 w-6" />
              Nouveau Tableau de Bord
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Créer
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateDashboardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveDashboard}
      />
    </div>
  );
};

export default Home;
