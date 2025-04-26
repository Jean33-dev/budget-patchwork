
import { ErrorBoundary } from "../error-boundary/ErrorBoundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const DashboardGridErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement des tableaux de bord</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">Impossible de charger les tableaux de bord.</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
