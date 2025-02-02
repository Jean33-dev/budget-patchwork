import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories] = useState([
    { 
      id: "1", 
      name: "Logement", 
      budgets: ["Budget Logement"],
      total: 2000
    },
    { 
      id: "2", 
      name: "Alimentation", 
      budgets: ["Budget Alimentation"],
      total: 800
    }
  ]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/budget")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="assignments">Assignations</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Budgets associés : {category.budgets.join(", ")}
                </div>
                <div className="mt-2 font-semibold">
                  Total : {category.total.toFixed(2)} €
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignation des Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fonctionnalité à venir : Vous pourrez bientôt assigner des budgets aux catégories ici.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Categories;