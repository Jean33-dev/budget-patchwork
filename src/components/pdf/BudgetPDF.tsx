import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { BudgetPDFDocument } from "./components/BudgetPDFDocument";
import { BudgetPDFDownloadProps } from "./types/pdfTypes";
import { useTheme } from "@/context/ThemeContext";

export const BudgetPDFDownload = ({ 
  fileName = "rapport-budget.pdf",
  totalIncome,
  totalExpenses,
  budgets,
  incomes,
  expenses,
  className,
  onClick,
  currency: currencyProp,
}: BudgetPDFDownloadProps) => {
  const { currency } = useTheme();

  return (
    <PDFDownloadLink
      document={
        <BudgetPDFDocument 
          totalIncome={totalIncome} 
          totalExpenses={totalExpenses} 
          budgets={budgets}
          incomes={incomes}
          expenses={expenses}
          currency={currencyProp || currency}
        />
      }
      fileName={fileName}
      className={className}
      onClick={onClick}
    >
      {({ loading }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          <FileDown className="h-4 w-4" />
          {loading ? "Génération..." : "Télécharger PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
