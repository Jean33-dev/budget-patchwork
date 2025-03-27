
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface BudgetLoadingErrorProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export const BudgetLoadingError = ({ onRetry, isRetrying }: BudgetLoadingErrorProps) => {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[400px]">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Impossible d'initialiser la base de données. Vérifiez votre connexion internet et assurez-vous que votre navigateur est à jour.
      </p>
      <Button 
        onClick={onRetry} 
        disabled={isRetrying}
        className="flex items-center gap-2"
      >
        {isRetrying ? "Tentative en cours..." : "Réessayer"}
        {isRetrying && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      </Button>
    </div>
  );
};
