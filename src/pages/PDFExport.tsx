
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Download, Check } from "lucide-react";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PDFExportLocationState {
  totalIncome: number;
  totalExpenses: number;
  budgets: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
  }>;
  currentDate: Date;
}

const PDFExport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalIncome, totalExpenses, budgets, currentDate } = 
    (location.state as PDFExportLocationState) || { 
      totalIncome: 0, 
      totalExpenses: 0, 
      budgets: [], 
      currentDate: new Date() 
    };
  
  // Options de personnalisation (toutes activées par défaut)
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeBudgets, setIncludeBudgets] = useState(true);
  const [includeIncomes, setIncludeIncomes] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(true);
  
  // Filtrer les listes selon les types et les mapper aux bons types
  const incomesList = budgets
    .filter(budget => budget.type === "income")
    .map(income => ({
      id: income.id,
      title: income.title,
      budget: income.budget,
      type: "income" as const
    }));
    
  const expensesList = budgets
    .filter(budget => budget.type === "expense")
    .map(expense => ({
      id: expense.id,
      title: expense.title,
      budget: expense.budget,
      type: "expense" as const,
      date: undefined
    }));
  
  // Nom du fichier avec le mois et l'année
  const fileName = `rapport-budget-${currentDate.toISOString().slice(0, 7)}.pdf`;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl">Personnalisation de l'export PDF</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Options d'export</CardTitle>
              <CardDescription>
                Sélectionnez les sections à inclure dans votre rapport PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="summary" 
                  checked={includeSummary} 
                  onCheckedChange={(checked) => setIncludeSummary(!!checked)} 
                />
                <Label htmlFor="summary">Inclure le résumé financier</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="budgets" 
                  checked={includeBudgets} 
                  onCheckedChange={(checked) => setIncludeBudgets(!!checked)} 
                />
                <Label htmlFor="budgets">Inclure la liste des budgets</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incomes" 
                  checked={includeIncomes} 
                  onCheckedChange={(checked) => setIncludeIncomes(!!checked)} 
                />
                <Label htmlFor="incomes">Inclure les revenus</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="expenses" 
                  checked={includeExpenses} 
                  onCheckedChange={(checked) => setIncludeExpenses(!!checked)} 
                />
                <Label htmlFor="expenses">Inclure les dépenses</Label>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
              <CardDescription>
                Prévisualisation du contenu de votre rapport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {includeSummary && (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Résumé financier</span>
                </div>
              )}
              
              {includeBudgets && (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Liste des budgets ({budgets.filter(b => b.type === "budget").length})</span>
                </div>
              )}
              
              {includeIncomes && (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Revenus ({incomesList.length})</span>
                </div>
              )}
              
              {includeExpenses && (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Dépenses ({expensesList.length})</span>
                </div>
              )}
              
              <BudgetPDFDownload
                fileName={fileName}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                budgets={budgets}
                incomes={includeIncomes ? incomesList : undefined}
                expenses={includeExpenses ? expensesList : undefined}
                className="mt-4"
              />
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Le fichier PDF sera généré avec les paramètres actuels</span>
              </div>
              
              <div className="mt-4">
                <BudgetPDFDownload
                  fileName={fileName}
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                  budgets={budgets}
                  incomes={includeIncomes ? incomesList : undefined}
                  expenses={includeExpenses ? expensesList : undefined}
                >
                  <Button className="w-full flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger le rapport
                  </Button>
                </BudgetPDFDownload>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFExport;
