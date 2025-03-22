
import { Loader2 } from "lucide-react";

export const BudgetLoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Chargement des budgets...</p>
    </div>
  );
};
