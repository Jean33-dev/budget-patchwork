
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LineChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { EditDashboardDialog } from "@/components/dashboard/EditDashboardDialog";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("Budget Personnel");

  const handleCreateDashboard = () => {
    toast({
      title: "Bientôt disponible",
      description: "La création de nouveaux tableaux de bord sera disponible prochainement.",
    });
  };

  const handleEditDashboard = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveDashboardName = (newName: string) => {
    setDashboardTitle(newName);
    setIsEditDialogOpen(false);
    toast({
      title: "Nom modifié",
      description: "Le nom du tableau de bord a été mis à jour.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/budget")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="h-6 w-6" />
                {dashboardTitle}
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
            <CardDescription>
              Gérez vos revenus et dépenses mensuels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Suivez vos dépenses, créez des enveloppes budgétaires et analysez vos habitudes financières.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-6 w-6" />
              Nouveau Tableau de Bord
            </CardTitle>
            <CardDescription>
              Créez un nouveau tableau de bord
            </CardDescription>
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
