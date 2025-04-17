
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DatabaseErrorAlertProps {
  onRetry: () => void;
  onForceReload: () => void;
}

export const DatabaseErrorAlert = ({
  onRetry,
  onForceReload,
}: DatabaseErrorAlertProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur de chargement de la base de données</AlertTitle>
      <AlertDescription>
        <p className="mb-4">
          Impossible de charger ou d'initialiser la base de données après plusieurs tentatives.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
          <Button
            variant="destructive"
            onClick={onForceReload}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir la page
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
