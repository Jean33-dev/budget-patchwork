
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
    updateCategoryTotals
  } = useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        console.log("Chargement des budgets...");
        const budgets = await db.getBudgets();
        console.log('Budgets chargés dans Categories:', budgets);
        
        if (!budgets || budgets.length === 0) {
          console.log("Aucun budget disponible");
          // Optionnel : ajouter des budgets par défaut pour le test
          const defaultBudgets: Budget[] = [
            {
              id: "budget1",
              title: "Budget Test 1",
              budget: 1000,
              spent: 0,
              type: "budget"
            },
            {
              id: "budget2",
              title: "Budget Test 2",
              budget: 2000,
              spent: 0,
              type: "budget"
            }
          ];
          
          for (const budget of defaultBudgets) {
            await db.addBudget(budget);
          }
          
          setAvailableBudgets(defaultBudgets);
        } else {
          setAvailableBudgets(budgets);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des budgets:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les budgets"
        });
      }
    };
    
    loadBudgets();
  }, [toast]);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleBudgetAssignment = async (categoryId: string, budgetId: string) => {
    await handleAssignBudget(categoryId, budgetId, availableBudgets);
    updateCategoryTotals(categoryId, availableBudgets);
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
              onRemove={handleRemoveBudget}
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
