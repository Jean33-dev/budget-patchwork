
import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { BudgetPDFProps } from "../types/pdfTypes";
import { BudgetSummarySection } from "./BudgetSummarySection";
import { BudgetsSection } from "./BudgetsSection";
import { IncomesSection } from "./IncomesSection";
import { ExpensesSection } from "./ExpensesSection";

export const BudgetPDFDocument: React.FC<BudgetPDFProps> = ({ 
  totalIncome, 
  totalExpenses, 
  budgets, 
  incomes, 
  expenses 
}) => {
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rapport Budgétaire</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <BudgetSummarySection totalIncome={totalIncome} totalExpenses={totalExpenses} />
        <BudgetsSection budgets={budgets} />
        <IncomesSection incomes={incomes} />
        <ExpensesSection expenses={expenses} />

        <View style={styles.footer}>
          <Text>Généré le {formattedDate} • Budget App</Text>
        </View>
      </Page>
    </Document>
  );
};
