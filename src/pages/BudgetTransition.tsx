
import React from "react";
import { useNavigate } from "react-router-dom";
import { TransitionPageHeader } from "@/components/budget-transition/TransitionPageHeader";
import { TransitionInfoBox } from "@/components/budget-transition/TransitionInfoBox";
import { TransitionEnvelopeGrid } from "@/components/budget-transition/TransitionEnvelopeGrid";
import { TransitionActionButtons } from "@/components/budget-transition/TransitionActionButtons";
import { useTransition } from "@/hooks/useTransition";

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
    handleTransitionConfirm
  } = useTransition(() => navigate("/dashboard/budget"));

  const handleBack = () => navigate("/dashboard/budget");

  // Add debug logs
  console.log("BudgetTransition rendering with envelopes:", envelopes);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <TransitionPageHeader onBackClick={handleBack} />

      <div className="space-y-6">
        <TransitionInfoBox />

        <TransitionEnvelopeGrid 
          envelopes={envelopes} 
          onOptionChange={handleOptionChange}
          onTransferTargetChange={handleTransferTargetChange}
          onPartialAmountChange={handlePartialAmountChange}
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
