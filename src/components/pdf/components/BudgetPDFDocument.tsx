
import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { BudgetSummarySection } from "./BudgetSummarySection";
import { BudgetsSection } from "./BudgetsSection";
import { IncomesSection } from "./IncomesSection";
import { ExpensesSection } from "./ExpensesSection";
import { translations } from "@/i18n/translations";
import { BudgetPDFProps } from "../types/pdfTypes";

export const BudgetPDFDocument: React.FC<BudgetPDFProps & { language?: string }> = ({ 
  totalIncome, 
  totalExpenses, 
  budgets, 
  incomes, 
  expenses,
  currency = "EUR",
  language = "fr" // fallback français si jamais
}) => {
  const date = new Date();

  // On prend la traduction du PDF selon la langue
  const t = (key: string) =>
    translations[language]?.[key] ?? translations["en"]?.[key] ?? key;

  const formattedDate = new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("pdf.reportTitle")}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <BudgetSummarySection 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          currency={currency}
          language={language}
        />
        <BudgetsSection 
          budgets={budgets}
          currency={currency}
          language={language}
        />
        <IncomesSection 
          incomes={incomes}
          currency={currency}
          language={language}
        />
        <ExpensesSection 
          expenses={expenses}
          currency={currency}
          language={language}
        />

        <View style={styles.footer}>
          <Text>
            {t("pdf.footer").replace("{{date}}", formattedDate)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
