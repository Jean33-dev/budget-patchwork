
import { Category } from "@/types/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
}

export const CategoryCard = ({ category, onEdit }: CategoryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{category.name}</CardTitle>
            {category.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {category.description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Budgets associés : {category.budgets.length > 0 ? category.budgets.join(", ") : "Aucun budget assigné"}
        </div>
        <div className="mt-2 font-semibold">
          Total : {category.total.toFixed(2)} €
        </div>
      </CardContent>
    </Card>
  );
};
