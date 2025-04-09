
import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  isProcessing: boolean;
}

export const ProcessingIndicator = ({ isProcessing }: ProcessingIndicatorProps) => {
  if (!isProcessing) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-lg font-medium">Opération en cours...</p>
          <p className="text-sm text-gray-500 text-center">
            Veuillez patienter pendant le traitement de votre demande.
          </p>
        </div>
      </div>
    </div>
  );
};
