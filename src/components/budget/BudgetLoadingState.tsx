
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetLoadingStateProps {
  attempt?: number;
  maxAttempts?: number;
}

export const BudgetLoadingState = ({ attempt = 1, maxAttempts = 3 }: BudgetLoadingStateProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground mb-2 text-lg font-medium">Chargement des budgets...</p>
      <p className="text-xs text-muted-foreground max-w-md text-center mb-4">
        Initialisation de la base de données. Cela peut prendre quelques instants 
        lors du premier chargement ou si les données ne sont pas en cache.
        {attempt > 1 && maxAttempts > 1 && (
          <span className="block mt-2 font-medium text-amber-600">
            Tentative {attempt}/{maxAttempts}...
          </span>
        )}
      </p>
      
      {attempt >= maxAttempts && (
        <div className="mt-4">
          <p className="text-xs text-amber-600 mb-2">
            Le chargement semble prendre plus de temps que prévu.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="text-xs"
          >
            Rafraîchir la page
          </Button>
        </div>
      )}
    </div>
  );
};
