
import { Loader2 } from "lucide-react";

interface BudgetLoadingStateProps {
  attempt?: number;
  maxAttempts?: number;
}

export const BudgetLoadingState = ({ attempt = 1, maxAttempts = 3 }: BudgetLoadingStateProps) => {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground mb-2">Chargement des budgets...</p>
      <p className="text-xs text-muted-foreground max-w-md text-center">
        Initialisation de la base de données. Cela peut prendre quelques instants 
        lors du premier chargement ou si les données ne sont pas en cache.
        {attempt > 1 && maxAttempts > 1 && (
          <span className="block mt-2 font-medium">
            Tentative {attempt}/{maxAttempts}...
          </span>
        )}
      </p>
    </div>
  );
};
