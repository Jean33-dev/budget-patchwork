
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/categories";
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

// On charge les budgets depuis le localStorage
const BUDGETS_STORAGE_KEY = "app_budgets";
const getStoredBudgets = () => {
  const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [
    { id: "1", title: "Budget Logement", amount: 1000, spent: 800 },
    { id: "2", title: "Budget Alimentation", amount: 500, spent: 450 },
    { id: "3", title: "Budget Transport", amount: 200, spent: 180 },
    { id: "4", title: "Budget Loisirs", amount: 300, spent: 250 }
  ];
};

const Categories = () => {
  const navigate = useNavigate();
  const [availableBudgets, setAvailableBudgets] = useState(getStoredBudgets());
  const { 
    categories, 
    handleAssignBudget, 
    handleRemoveBudget, 
    updateCategoryName,
    getAvailableBudgetsForCategory 
  } = useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  // Mettre à jour la liste des budgets quand le localStorage change
  window.addEventListener('storage', (e) => {
    if (e.key === BUDGETS_STORAGE_KEY) {
      setAvailableBudgets(getStoredBudgets());
    }
  });

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
              onAssign={(categoryId, budgetId) => 
                handleAssignBudget(categoryId, budgetId, availableBudgets)
              }
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
