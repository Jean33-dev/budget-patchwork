import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LineChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { EditDashboardDialog } from "@/components/dashboard/EditDashboardDialog";
import { db } from "@/services/database";
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("Budget Personnel");
  const [isLoading, setIsLoading] = useState(true);

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
          await db.addBudget({
            id: "dashboard_title",
            title: defaultTitle,
            budget: 0,
            spent: 0,
            type: 'budget',
            carriedOver: 0
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

  const handleCreateDashboard = async () => {
    try {
      const newDashboard = {
        id: uuidv4(),
        title: "Nouveau tableau de bord",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.addDashboard(newDashboard);
      navigate(`/dashboard/${newDashboard.id}`);
      
      toast({
        title: "Succès",
        description: "Le tableau de bord a été créé",
      });
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
      <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

export default Home;
