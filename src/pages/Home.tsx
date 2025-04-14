
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LineChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { EditDashboardDialog } from "@/components/dashboard/EditDashboardDialog";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { db } from "@/services/database";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("Budget Personnel");
  const [isLoading, setIsLoading] = useState(true);

  // Charger le titre du tableau de bord depuis la base de données
  useEffect(() => {
    const loadDashboardTitle = async () => {
      try {
        await db.init();
        const budgets = await db.getBudgets();
        
        // Chercher un budget avec le nom spécial "dashboard_title"
        const dashboardTitleBudget = budgets.find(b => b.id === "dashboard_title");
        
        if (dashboardTitleBudget) {
          setDashboardTitle(dashboardTitleBudget.title);
        } else {
          // Si le budget n'existe pas encore, le créer avec la valeur par défaut
          const defaultTitle = localStorage.getItem("dashboardTitle") || "Budget Personnel";
          await db.addBudget({
            id: "dashboard_title",
            title: defaultTitle,
            budget: 0,
            spent: 0,
            type: 'budget',
            carriedOver: 0
          });
          setDashboardTitle(defaultTitle);
          
          // Supprimer l'ancienne valeur de localStorage après migration
          localStorage.removeItem("dashboardTitle");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du titre:", error);
        // Fallback sur localStorage en cas d'erreur
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

  const handleCreateDashboard = () => {
    toast({
      title: "Bientôt disponible",
      description: "La création de nouveaux tableaux de bord sera disponible prochainement.",
    });
  };

  const handleEditDashboard = () => {
    setIsEditDialogOpen(true);
  };

  const handleOpenSettings = () => {
    setIsSettingsDialogOpen(true);
  };

  const handleSaveDashboardName = async (newName: string) => {
    try {
      // Mettre à jour le titre dans la base de données
      const budgets = await db.getBudgets();
      const dashboardTitleBudget = budgets.find(b => b.id === "dashboard_title");
      
      if (dashboardTitleBudget) {
        await db.updateBudget({
          ...dashboardTitleBudget,
          title: newName
        });
      } else {
        await db.addBudget({
          id: "dashboard_title",
          title: newName,
          budget: 0,
          spent: 0,
          type: 'budget',
          carriedOver: 0
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
        <Button variant="outline" size="icon" onClick={handleOpenSettings}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/budget")}>
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
            {/* Contenu de la carte supprimé comme demandé */}
          </CardContent>
        </Card>

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
      </div>

      <EditDashboardDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentName={dashboardTitle}
        onSave={handleSaveDashboardName}
      />
      
      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      />
    </div>
  );
};

export default Home;
