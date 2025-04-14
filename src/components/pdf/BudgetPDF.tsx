
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { BudgetPDFDocument } from "./components/BudgetPDFDocument";
import { BudgetPDFDownloadProps } from "./types/pdfTypes";

export const BudgetPDFDownload = ({ 
  fileName = "rapport-budget.pdf",
  totalIncome,
  totalExpenses,
  budgets,
  incomes,
  expenses,
  className,
  onClick
}: BudgetPDFDownloadProps) => {
  return (
    <PDFDownloadLink
      document={
        <BudgetPDFDocument 
          totalIncome={totalIncome} 
          totalExpenses={totalExpenses} 
          budgets={budgets}
          incomes={incomes}
          expenses={expenses}
        />
      }
      fileName={fileName}
      className={className}
      onClick={onClick}
    >
      {({ loading }) => (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          {loading ? "Génération..." : "Télécharger PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
