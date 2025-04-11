
import React from "react";
import { PDFDownloadLink, Document, Page } from "@react-pdf/renderer";
import type { BlobProviderParams, PDFDownloadLinkProps } from "@react-pdf/renderer";
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
      {(props: BlobProviderParams) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2"
          disabled={props.loading}
        >
          <FileDown className="h-4 w-4" />
          {props.loading ? "Génération..." : "Télécharger PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
