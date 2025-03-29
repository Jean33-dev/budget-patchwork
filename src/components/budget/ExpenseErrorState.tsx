
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Database, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseErrorStateProps {
  retryAttempt: number;
  maxRetryAttempts: number;
  isRetrying: boolean;
  handleRetry: () => void;
  handleForceReload: () => void;
  handleClearCacheAndReload: () => void;
}

export const ExpenseErrorState = ({
  retryAttempt,
  maxRetryAttempts,
  isRetrying,
  handleRetry,
  handleForceReload,
  handleClearCacheAndReload
}: ExpenseErrorStateProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur de chargement</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Impossible de charger la base de données. {retryAttempt >= maxRetryAttempts ? 
            "Nombre maximal de tentatives atteint. Veuillez rafraîchir la page ou vider le cache." : 
            "Veuillez essayer de rafraîchir la page ou utiliser les options ci-dessous."}
        </p>
        <div className="mt-4 space-x-2 flex flex-wrap gap-2">
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying || retryAttempt >= maxRetryAttempts} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isRetrying ? "Tentative en cours..." : "Réessayer"}
          </Button>
          
          <Button 
            onClick={handleForceReload}
            className="flex items-center gap-2"
            variant={retryAttempt >= maxRetryAttempts ? "default" : "outline"}
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir la page
          </Button>
          
          {retryAttempt >= 3 && (
            <Button 
              onClick={handleClearCacheAndReload}
              className="flex items-center gap-2"
              variant="destructive"
            >
              <Database className="h-4 w-4" />
              Vider le cache et rafraîchir
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
