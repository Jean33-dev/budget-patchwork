
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("Budget Personnel");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboards, setDashboards] = useState<Array<{id: string, title: string}>>([]);

  // Charger le titre du dashboard principal
  useEffect(() => {
    const loadDashboardTitle = async () => {
      try {
        await db.init();
        const budgets = await db.getBudgets();
        const dashboardTitleBudget = budgets.find(b => b.id === "dashboard_title");
        
        if (dashboardTitleBudget) {
          setDashboardTitle(dashboardTitleBudget.title);
        } else {
          const defaultTitle = localStorage.getItem("dashboardTitle") || "Budget Personnel";
          const defaultDashboardId = "default"; // ID par défaut pour le dashboard principal
          await db.addBudget({
            id: "dashboard_title",
            title: defaultTitle,
            budget: 0,
            spent: 0,
            type: 'budget',
            carriedOver: 0,
            dashboardId: defaultDashboardId
          });
          setDashboardTitle(defaultTitle);
          localStorage.removeItem("dashboardTitle");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du titre:", error);
        const localTitle = localStorage.getItem("dashboardTitle");
        if (localTitle) {
          setDashboardTitle(localTitle);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardTitle();
  }, []);

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

  const handleEditDashboard = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveDashboardName = async (newName: string) => {
    try {
      const budgets = await db.getBudgets();
      const dashboardTitleBudget = budgets.find(b => b.id === "dashboard_title");
      const defaultDashboardId = "default"; // ID par défaut pour le dashboard principal
      
      if (dashboardTitleBudget) {
        await db.updateBudget({
          ...dashboardTitleBudget,
          title: newName,
          dashboardId: dashboardTitleBudget.dashboardId || defaultDashboardId
        });
      } else {
        await db.addBudget({
          id: "dashboard_title",
          title: newName,
          budget: 0,
          spent: 0,
          type: 'budget',
          carriedOver: 0,
          dashboardId: defaultDashboardId
        });
      }
      
      setDashboardTitle(newName);
      setIsEditDialogOpen(false);
      toast({
        title: "Nom modifié",
        description: "Le nom du tableau de bord a été mis à jour.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du titre:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le nom du tableau de bord."
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
        {/* Dashboard principal */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => navigate(`/dashboard/${encodeURIComponent(dashboardTitle)}`)}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="h-6 w-6" />
                {isLoading ? "Chargement..." : dashboardTitle}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDashboard();
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

        {/* Autres tableaux de bord */}
        {dashboards.filter(d => d.id !== "dashboard_title").map((dashboard) => (
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

      <EditDashboardDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentName={dashboardTitle}
        onSave={handleSaveDashboardName}
      />

      <CreateDashboardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveDashboard}
      />
    </div>
  );
};

export default Home;
