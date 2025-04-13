
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BudgetStats } from "@/components/dashboard/BudgetStats";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { AlertTriangle, FileText } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [nextDate, setNextDate] = useState<Date | null>(null);
  const [pdfExported, setPdfExported] = useState(false);

  // Utilisation du hook useBudgets pour obtenir toutes les données
  const { 
    budgets, 
    totalRevenues, 
    totalExpenses, 
    totalBudgets,
    remainingAmount 
  } = useBudgets();

  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
    // Show transition dialog when month is changed
    setNextDate(newDate);
    setShowTransitionDialog(true);
    setPdfExported(false);
  };

  const handleTransitionConfirm = () => {
    if (nextDate) {
      navigate("/dashboard/budget/transition");
    }
    setShowTransitionDialog(false);
  };

  const handleTransitionCancel = () => {
    setNextDate(null);
    setShowTransitionDialog(false);
  };
  
  // Suivi de l'export PDF
  const handlePDFExported = () => {
    setPdfExported(true);
  };

  // Créer la liste des enveloppes à partir des budgets
  const envelopes = budgets.map(budget => ({
    id: budget.id,
    title: budget.title,
    budget: budget.budget,
    spent: budget.spent,
    type: budget.type
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      <DashboardHeader
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        onBackClick={() => navigate("/")}
      />
      
      <div className="flex justify-end mb-4 gap-2">
        <BudgetPDFDownload
          fileName={`rapport-budget-${currentDate.toISOString().slice(0, 7)}.pdf`}
          totalIncome={totalRevenues}
          totalExpenses={totalExpenses}
          budgets={envelopes}
          className="mr-2"
        />
        
        <Button variant="outline" onClick={() => navigate("/dashboard/budget/transition")} className="flex items-center gap-2">
          <CalendarPlus className="h-4 w-4" />
          Nouveau mois
        </Button>
      </div>
      
      <DashboardOverview
        totalIncome={totalRevenues}
        totalExpenses={totalExpenses}
        envelopes={envelopes}
      />
      
      <BudgetStats
        remainingBudget={remainingAmount}
        remainingBudgetAfterExpenses={totalBudgets - totalExpenses}
      />

      <AlertDialog open={showTransitionDialog} onOpenChange={setShowTransitionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transition vers un nouveau mois</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div>
                Voulez-vous configurer la transition des budgets vers le nouveau mois ? 
                Cela vous permettra de définir comment chaque budget doit être géré pour le mois suivant.
              </div>
              
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Attention : Sauvegardez vos données</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    En passant au nouveau mois, vos dépenses et revenus actuels seront réinitialisés.
                    Ces données seront définitivement perdues.
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-medium">Nous vous recommandons d'exporter vos données en PDF avant de continuer.</span>
                  </div>
                  
                  <div className="mt-2" onClick={handlePDFExported}>
                    <BudgetPDFDownload
                      fileName={`rapport-budget-${currentDate.toISOString().slice(0, 7)}.pdf`}
                      totalIncome={totalRevenues}
                      totalExpenses={totalExpenses}
                      budgets={envelopes}
                    />
                  </div>
                  
                  {pdfExported && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      PDF exporté avec succès. Vous pouvez maintenant procéder à la transition.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleTransitionCancel}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleTransitionConfirm}>
              Configurer la transition
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
