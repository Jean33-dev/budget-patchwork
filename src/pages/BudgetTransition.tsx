
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransitionPageHeader } from "@/components/budget-transition/TransitionPageHeader";
import { TransitionInfoBox } from "@/components/budget-transition/TransitionInfoBox";
import { TransitionEnvelopeGrid } from "@/components/budget-transition/TransitionEnvelopeGrid";
import { TransitionActionButtons } from "@/components/budget-transition/TransitionActionButtons";
import { useTransition } from "@/hooks/useTransition";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileText } from "lucide-react";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { useDashboardTitle } from "@/hooks/useDashboardTitle";

export const BudgetTransition = () => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pdfExported, setPdfExported] = useState(false);
  const { totalRevenues, totalExpenses, budgets } = useBudgets();
  const { currentDashboardId } = useDashboardContext();
  const { dashboardTitle } = useDashboardTitle();
  
  // Vérifier que nous avons bien un dashboard actif
  if (!currentDashboardId) {
    console.error("BudgetTransition: Aucun dashboard sélectionné");
  } else {
    console.log(`BudgetTransition: Opération sur le dashboard ${currentDashboardId}`);
  }
  
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
  
  // Afficher la boîte de dialogue de confirmation au lieu de procéder immédiatement
  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };
  
  // Procéder à la transition une fois confirmé
  const handleFinalConfirm = () => {
    handleTransitionConfirm();
    setShowConfirmDialog(false);
  };
  
  // Génération du nom du fichier PDF avec l'ID du dashboard
  const pdfFileName = `rapport-budget-${currentDashboardId}-avant-transition-${new Date().toISOString().slice(0, 10)}.pdf`;
  
  // Marqueur lorsque le PDF est exporté
  const handlePDFExported = () => {
    setPdfExported(true);
  };

  // Add debug logs
  console.log("BudgetTransition rendering with envelopes:", envelopes);
  console.log(`BudgetTransition pour le dashboard: ${currentDashboardId}`);

  // Filter only the budgets for the current dashboard
  const dashboardBudgets = budgets.filter(budget => 
    String(budget.dashboardId) === String(currentDashboardId)
  );
  
  console.log(`BudgetTransition: ${dashboardBudgets.length} budgets filtrés pour le dashboard ${currentDashboardId}`);

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
          onMultiTransferChange={handleMultiTransferChange}
        />

        <TransitionActionButtons 
          onCancel={handleBack}
          onConfirm={handleConfirmClick}
          isProcessing={isProcessing}
        />
      </div>
      
      {/* Boîte de dialogue de confirmation avec avertissement */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Attention : Données en danger</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Sauvegardez vos données avant de continuer</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    La transition vers un nouveau mois va réinitialiser toutes vos dépenses et revenus 
                    du dashboard actuel ({dashboardTitle || "Sans titre"}).
                    Une fois cette opération effectuée, les données du mois actuel seront définitivement perdues.
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-medium">Nous vous recommandons d'exporter vos données en PDF avant de continuer.</span>
                  </div>
                </AlertDescription>
              </Alert>
              
              {pdfExported && (
                <p className="text-xs text-green-600 dark:text-green-400 text-center mt-2">
                  PDF exporté avec succès. Vous pouvez maintenant procéder à la transition.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <BudgetPDFDownload
              fileName={pdfFileName}
              totalIncome={totalRevenues}
              totalExpenses={totalExpenses}
              budgets={dashboardBudgets} // Use filtered budgets
              className="w-full"
              onClick={handlePDFExported}
            />
            <AlertDialogAction onClick={handleFinalConfirm} className="w-full">
              Confirmer la transition
            </AlertDialogAction>
            <AlertDialogCancel className="w-full mt-0">Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Add default export to fix the error in App.tsx
export default BudgetTransition;
