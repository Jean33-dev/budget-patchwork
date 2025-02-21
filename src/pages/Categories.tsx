import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, Budget } from "@/types/categories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { AssignmentCard } from "@/components/categories/AssignmentCard";
import { EditCategoryDialog } from "@/components/categories/EditCategoryDialog";
import { useCategories } from "@/hooks/useCategories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/services/database";
import { useToast } from "@/hooks/use-toast";

const Categories = () => {
  const navigate = useNavigate();
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const { toast } = useToast();

  const { 
    categories, 
    handleAssignBudget, 
    handleRemoveBudget, 
    updateCategoryName,
    getAvailableBudgetsForCategory,
    updateCategoryTotals,
    refreshCategories 
  } = useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadBudgets = async () => {
    try {
      const budgets = await db.getBudgets();
      console.log('État actuel des budgets:', budgets);
      setAvailableBudgets(budgets);
    } catch (error) {
      console.error("Erreur lors du chargement des budgets:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les budgets"
      });
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleBudgetAssignment = async (categoryId: string, budgetId: string) => {
    try {
      console.log('Assignation de budget - Début:', { categoryId, budgetId });
      console.log('Categories actuelles:', categories);
      console.log('Budgets disponibles:', availableBudgets);
      
      await handleAssignBudget(categoryId, budgetId, availableBudgets);
      await loadBudgets();
      
      console.log('Assignation terminée avec succès');
    } catch (error) {
      console.error("Erreur lors de l'assignation du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'assigner le budget"
      });
    }
  };

  const handleBudgetRemoval = async (categoryId: string, budgetId: string) => {
    try {
      await handleRemoveBudget(categoryId, budgetId, availableBudgets);
      await updateCategoryTotals(categoryId, availableBudgets);
      await loadBudgets();
      await refreshCategories();
    } catch (error) {
      console.error("Erreur lors du retrait du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le budget"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
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

        <h1 className="text-xl font-semibold">Gestion des Catégories</h1>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="assignments">Assignations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
            />
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {categories.map((category) => (
            <AssignmentCard
              key={category.id}
              category={category}
              availableBudgets={availableBudgets}
              onAssign={handleBudgetAssignment}
              onRemove={handleBudgetRemoval}
              getAvailableBudgets={(categoryId) => 
                getAvailableBudgetsForCategory(categoryId, availableBudgets)
              }
            />
          ))}
        </TabsContent>
      </Tabs>

      <EditCategoryDialog
        category={editingCategory}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={updateCategoryName}
      />
    </div>
  );
};

export default Categories;
