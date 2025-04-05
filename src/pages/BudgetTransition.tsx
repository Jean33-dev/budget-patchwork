
import React from "react";
import { useNavigate } from "react-router-dom";
import { TransitionPageHeader } from "@/components/budget-transition/TransitionPageHeader";
import { TransitionInfoBox } from "@/components/budget-transition/TransitionInfoBox";
import { TransitionEnvelopeGrid } from "@/components/budget-transition/TransitionEnvelopeGrid";
import { TransitionActionButtons } from "@/components/budget-transition/TransitionActionButtons";
import { useTransition } from "@/hooks/useTransition";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const BudgetTransition = () => {
  const navigate = useNavigate();
  
  const {
    envelopes,
    selectedEnvelope,
    showPartialDialog,
    showTransferDialog,
    isProcessing,
    setSelectedEnvelope,
    setShowPartialDialog,
    setShowTransferDialog,
    handleOptionChange,
    handlePartialAmountChange,
    handleTransferTargetChange,
    handleMultiTransferChange,
    handleTransitionConfirm
  } = useTransition(() => navigate("/dashboard/budget"));

  const handleBack = () => navigate("/dashboard/budget");

  // Add debug logs
  console.log("BudgetTransition rendering with envelopes:", envelopes);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <TransitionPageHeader onBackClick={handleBack} />

      <Alert variant="warning" className="border-yellow-300 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Attention</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Configurer correctement cette transition est critique. Si vous ne le faites pas, 
          toutes les données budgétaires du mois en cours (dépenses et revenus) seront définitivement supprimées 
          sans possibilité de récupération.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <TransitionInfoBox />

        <TransitionEnvelopeGrid 
          envelopes={envelopes} 
          onOptionChange={handleOptionChange}
          onTransferTargetChange={handleTransferTargetChange}
          onPartialAmountChange={handlePartialAmountChange}
          onMultiTransferChange={handleMultiTransferChange}
        />

        <TransitionActionButtons 
          onCancel={handleBack}
          onConfirm={handleTransitionConfirm}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

// Add default export to fix the error in App.tsx
export default BudgetTransition;
