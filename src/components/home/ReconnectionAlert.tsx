
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ReconnectionAlertProps {
  attempts: number;
  maxAttempts: number;
}

export const ReconnectionAlert = ({ attempts, maxAttempts }: ReconnectionAlertProps) => {
  return (
    <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-300">
      <AlertTitle className="text-amber-800">Tentative de reconnexion</AlertTitle>
      <AlertDescription className="text-amber-700">
        Tentative {attempts}/{maxAttempts} de connexion à la base de données...
      </AlertDescription>
    </Alert>
  );
};
