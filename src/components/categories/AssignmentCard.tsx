
import { Category, Budget } from "@/types/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AssignmentCardProps {
  category: Category;
  availableBudgets: Budget[];
  onAssign: (categoryId: string, budgetId: string) => void;
  onRemove: (categoryId: string, budgetTitle: string) => void;
  getAvailableBudgets: (categoryId: string) => Budget[];
}

export const AssignmentCard = ({ 
  category, 
  availableBudgets, 
  onAssign, 
  onRemove,
  getAvailableBudgets 
}: AssignmentCardProps) => {
  // Filtrer les budgets déjà assignés à cette catégorie
  const unassignedBudgets = getAvailableBudgets(category.id)
    .filter(budget => !category.budgets.includes(budget.title));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Assigner un budget</Label>
          <Select onValueChange={(value) => onAssign(category.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un budget" />
            </SelectTrigger>
            <SelectContent>
              {unassignedBudgets.map((budget) => (
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
                  onClick={() => onRemove(category.id, budget)}
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
  );
};
