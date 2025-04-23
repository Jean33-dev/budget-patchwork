
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LineChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { EditDashboardDialog } from "@/components/dashboard/EditDashboardDialog";
import { CreateDashboardDialog } from "@/components/dashboard/CreateDashboardDialog";
import { db } from "@/services/database";
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboards, setDashboards] = useState<Array<{id: string, title: string}>>([]);

  // Charger tous les tableaux de bord
  useEffect(() => {
    const loadDashboards = async () => {
      try {
        await db.init();
        console.log("Chargement des tableaux de bord...");
        const dashboardsData = await db.getDashboards();
        console.log("Tableaux de bord chargés:", dashboardsData);
        setDashboards(dashboardsData);
      } catch (error) {
        console.error("Erreur lors du chargement des tableaux de bord:", error);
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
      const newDashboard = {
        id: uuidv4(),
        title: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("Création d'un nouveau tableau de bord:", newDashboard);
      await db.addDashboard(newDashboard);
      
      // Rafraîchir la liste des dashboards
      const updatedDashboards = await db.getDashboards();
      setDashboards(updatedDashboards);
      
      navigate(`/dashboard/${newDashboard.id}`);
      
      toast({
        title: "Succès",
        description: "Le tableau de bord a été créé",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le tableau de bord"
      });
    }
  };
  
  const handleDeleteDashboard = async (id: string) => {
    try {
      await db.deleteDashboard(id);
      // Rafraîchir la liste des dashboards
      const updatedDashboards = await db.getDashboards();
      setDashboards(updatedDashboards);
      toast({
        title: "Succès",
        description: "Le tableau de bord a été supprimé",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le tableau de bord"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Liste des tableaux de bord existants */}
        {dashboards.map((dashboard) => (
          <Card 
            key={dashboard.id}
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => navigate(`/dashboard/${dashboard.id}`)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart className="h-6 w-6" />
                  {dashboard.title}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDashboard(dashboard.id);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Contenu de la carte */}
            </CardContent>
          </Card>
        ))}

        {/* Carte pour créer un nouveau tableau de bord */}
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
