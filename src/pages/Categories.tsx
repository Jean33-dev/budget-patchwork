
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Plus, Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // État pour le dialogue de création/modification
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const handleRemoveBudget = (categoryId: string, budgetTitle: string) => {
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            budgets: category.budgets.filter(b => b !== budgetTitle)
          };
        }
        return category;
      });
    });

    toast({
      title: "Budget retiré",
      description: "Le budget a été retiré de la catégorie avec succès."
    });
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide."
      });
      return;
    }

    if (editingCategory) {
      // Modification d'une catégorie existante
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, name: newCategoryName }
            : cat
        )
      );
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès."
      });
    } else {
      // Création d'une nouvelle catégorie
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        budgets: [],
        total: 0
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Catégorie créée",
        description: "La nouvelle catégorie a été créée avec succès."
      });
    }

    setDialogOpen(false);
    setNewCategoryName("");
    setEditingCategory(null);
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget")}>
              Tableau de Bord
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/income")}>
              Gérer les Revenus
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/categories")}>
              Gérer les Catégories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/budgets")}>
              Gérer les Budgets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/budget/expenses")}>
              Gérer les Dépenses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Catégorie
        </Button>
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
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
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
                      <li key={index} className="flex items-center justify-between">
                        <span>{budget}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBudget(category.id, budget)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Nom de la catégorie</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Entrez le nom de la catégorie"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
