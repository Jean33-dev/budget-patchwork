
import React, { useState } from "react";
import { AlertTriangle, FileText, Download } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";

export const TransitionWarningAlert = () => {
  const [exportedPDF, setExportedPDF] = useState(false);
  const { totalRevenues, totalExpenses, budgets } = useBudgets();
  
  const fileName = `rapport-budget-avant-transition-${new Date().toISOString().slice(0, 10)}.pdf`;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="flex items-center gap-2">
        Attention : Sauvegardez vos données avant de continuer
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-4">
        <p className="text-sm text-destructive">
          La transition vers un nouveau mois va réinitialiser toutes vos dépenses et revenus. 
          Une fois cette opération effectuée, les données du mois actuel seront définitivement perdues 
          et ne pourront pas être récupérées.
        </p>
        
        {!exportedPDF ? (
          <div className="flex items-center gap-2 mt-2">
            <FileText className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Nous vous recommandons vivement d'exporter vos données en PDF avant de continuer :</span>
            
            <div onClick={() => setExportedPDF(true)} className="ml-2">
              <BudgetPDFDownload
                fileName={fileName}
                totalIncome={totalRevenues}
                totalExpenses={totalExpenses}
                budgets={budgets}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">PDF exporté avec succès. Vous pouvez maintenant procéder à la transition.</span>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
