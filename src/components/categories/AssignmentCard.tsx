
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
  onRemove: (categoryId: string, budgetId: string) => void;
  getAvailableBudgets: (categoryId: string) => Budget[];
}

export const AssignmentCard = ({ 
  category, 
  availableBudgets, 
  onAssign, 
  onRemove,
  getAvailableBudgets 
}: AssignmentCardProps) => {
  console.log('Category:', category);
  console.log('Available Budgets:', availableBudgets);
  
  const unassignedBudgets = getAvailableBudgets(category.id);
  console.log('Unassigned Budgets:', unassignedBudgets);
  
  const assignedBudgets = category.budgets
    .map(budgetId => availableBudgets.find(b => b.id === budgetId))
    .filter((b): b is Budget => b !== undefined);
  
  console.log('Assigned Budgets:', assignedBudgets);

  const handleBudgetAssignment = (value: string) => {
    console.log('Assigning budget:', value, 'to category:', category.id);
    onAssign(category.id, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Assigner un budget</Label>
          {unassignedBudgets.length > 0 ? (
            <Select 
              onValueChange={handleBudgetAssignment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un budget" />
              </SelectTrigger>
              <SelectContent>
                {unassignedBudgets.map((budget) => (
                  <SelectItem 
                    key={budget.id} 
                    value={budget.id}
                    className="cursor-pointer"
                  >
                    {budget.title} ({budget.budget}€)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500">
              Tous les budgets disponibles ont déjà été assignés.
            </div>
          )}
        </div>
        <div className="text-sm">
          <p className="font-medium mb-2">Budgets actuellement assignés :</p>
          {assignedBudgets.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1">
              {assignedBudgets.map((budget) => (
                <li key={budget.id} className="flex items-center justify-between">
                  <span>{budget.title} ({budget.budget}€)</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(category.id, budget.id)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun budget assigné</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
