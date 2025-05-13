
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
  const maxAttemptsReached = retryAttempt >= maxRetryAttempts;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur de chargement</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Problème lors du chargement des données. {maxAttemptsReached ? 
            "Nombre maximal de tentatives atteint. Essayez de rafraîchir la page." : 
            "Veuillez essayer les options ci-dessous."}
        </p>
        <p className="mb-3 text-xs opacity-70">
          Si les problèmes persistent après modification ou suppression d'une dépense, utilisez le bouton "Rafraîchir la page".
        </p>
        <div className="mt-4 space-x-2 flex flex-wrap gap-2">
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying || maxAttemptsReached} 
            variant="outline" 
            className="flex items-center gap-2"
            title={maxAttemptsReached ? "Nombre maximal de tentatives atteint" : "Essayer de recharger les données"}
          >
            {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isRetrying ? "Tentative en cours..." : "Réessayer"}
          </Button>
          
          <Button 
            onClick={handleForceReload}
            className="flex items-center gap-2"
            variant={maxAttemptsReached ? "default" : "outline"}
            title="Rafraîchir complètement la page"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir la page
          </Button>
          
          {retryAttempt >= 2 && (
            <Button 
              onClick={handleClearCacheAndReload}
              className="flex items-center gap-2"
              variant="destructive"
              title="Vider le cache de la base de données et rafraîchir la page"
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
