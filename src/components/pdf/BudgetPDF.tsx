
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
  onClick,
  onComplete
}: BudgetPDFDownloadProps) => {
  // Fonction qui gère à la fois le onClick et onComplete
  const handleClick = () => {
    if (onClick) onClick();
  };

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
      onClick={handleClick}
      onComplete={onComplete}
    >
      {({ loading }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          <FileDown className="h-4 w-4" />
          {loading ? "Préparation du PDF..." : "Télécharger PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
