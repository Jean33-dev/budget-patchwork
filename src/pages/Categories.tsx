
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState([
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

  // Liste des budgets disponibles
  const availableBudgets = [
    { id: "1", title: "Budget Logement" },
    { id: "2", title: "Budget Alimentation" },
    { id: "3", title: "Budget Transport" },
    { id: "4", title: "Budget Loisirs" }
  ];

  const handleAssignBudget = (categoryId: string, budgetId: string) => {
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          const selectedBudget = availableBudgets.find(b => b.id === budgetId);
          if (selectedBudget && !category.budgets.includes(selectedBudget.title)) {
            return {
              ...category,
              budgets: [...category.budgets, selectedBudget.title]
            };
          }
        }
        return category;
      });
    });

    toast({
      title: "Budget assigné",
      description: "Le budget a été assigné à la catégorie avec succès."
    });
  };

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
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Assigner un budget</Label>
                  <Select onValueChange={(value) => handleAssignBudget(category.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBudgets
                        .filter(budget => !category.budgets.includes(budget.title))
                        .map((budget) => (
                          <SelectItem key={budget.id} value={budget.id}>
                            {budget.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-2">Budgets actuellement assignés :</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {category.budgets.map((budget, index) => (
                      <li key={index}>{budget}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Categories;
