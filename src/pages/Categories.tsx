
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, Budget } from "@/types/categories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { AssignmentCard } from "@/components/categories/AssignmentCard";
import { EditCategoryDialog } from "@/components/categories/EditCategoryDialog";
import { useCategories } from "@/hooks/useCategories";
import { db } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
import { useDashboardContext } from "@/hooks/useDashboardContext";

const Categories = () => {
  const navigate = useNavigate();
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const { toast } = useToast();
  const { currentDashboardId } = useDashboardContext();

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
      const allBudgets = await db.getBudgets();
      console.log('Tous les budgets récupérés:', allBudgets);
      
      // Filtrer les budgets par dashboardId
      const filteredBudgets = allBudgets.filter(budget => 
        String(budget.dashboardId) === String(currentDashboardId)
      );
      
      console.log(`Budgets filtrés pour le dashboard ${currentDashboardId}:`, filteredBudgets);
      setAvailableBudgets(filteredBudgets);
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
    console.log("Categories: chargement des budgets pour le dashboard:", currentDashboardId);
    loadBudgets();
  }, [currentDashboardId]);

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
      await loadBudgets();
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
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-6 border-b">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-sm hover:shadow-md hover:bg-primary/10 transition-all"
          onClick={() => navigate("/dashboard/budget")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Gestion des Catégories
          </h1>
          <p className="text-sm text-muted-foreground">
            Organisez et suivez vos dépenses par catégorie
          </p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="assignments">Assignations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4 mt-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
            />
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-4">
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
