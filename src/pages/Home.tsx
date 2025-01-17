import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateDashboard = () => {
    toast({
      title: "Bientôt disponible",
      description: "La création de nouveaux tableaux de bord sera disponible prochainement.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Mes Tableaux de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/budget")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-6 w-6" />
              Budget Personnel
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
    </div>
  );
};

export default Home;