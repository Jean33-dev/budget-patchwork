
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { formatAmount } from "@/utils/format-amount";
import { translations } from "@/i18n/translations";

interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  carriedOver?: number;
}

interface BudgetsSectionProps {
  budgets: Budget[];
  currency?: "EUR" | "USD" | "GBP";
  language?: string;
}

export const BudgetsSection: React.FC<BudgetsSectionProps> = ({ budgets, currency = "EUR", language = "fr" }) => {
  const t = (key: string) =>
    translations[language]?.[key] ?? translations["en"]?.[key] ?? key;
  const filteredBudgets = budgets.filter(b => b.type === "budget");
  
  if (!filteredBudgets.length) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("pdf.budgets")}</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>{t("pdf.name")}</Text>
          <Text style={styles.tableCellAmount}>{t("pdf.budget")}</Text>
          <Text style={styles.tableCellAmount}>{t("pdf.carriedOver")}</Text>
          <Text style={styles.tableCellAmount}>{t("pdf.spent")}</Text>
          <Text style={styles.tableCellAmount}>{t("pdf.remaining")}</Text>
        </View>
        {filteredBudgets.map((budget) => {
          const carriedOver = budget.carriedOver || 0;
          const totalBudget = budget.budget + carriedOver;
          const remaining = totalBudget - budget.spent;
          
          return (
            <View style={styles.tableRow} key={budget.id}>
              <Text style={styles.tableCell}>{budget.title}</Text>
              <Text style={styles.tableCellAmount}>{formatAmount(budget.budget, currency)}</Text>
              <Text style={styles.tableCellAmount}>{formatAmount(carriedOver, currency)}</Text>
              <Text style={styles.tableCellAmount}>{formatAmount(budget.spent, currency)}</Text>
              <Text style={styles.tableCellAmount}>{formatAmount(remaining, currency)}</Text>
            </View>
          );
        })}
        {/* Summary row */}
        <View style={[styles.tableRow, { backgroundColor: '#f8f9fa' }]}>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{t("pdf.total")}</Text>
          <Text style={[styles.tableCellAmount, { fontWeight: 'bold' }]}>
            {formatAmount(filteredBudgets.reduce((sum, b) => sum + b.budget, 0), currency)}
          </Text>
          <Text style={[styles.tableCellAmount, { fontWeight: 'bold' }]}>
            {formatAmount(filteredBudgets.reduce((sum, b) => sum + (b.carriedOver || 0), 0), currency)}
          </Text>
          <Text style={[styles.tableCellAmount, { fontWeight: 'bold' }]}>
            {formatAmount(filteredBudgets.reduce((sum, b) => sum + b.spent, 0), currency)}
          </Text>
          <Text style={[styles.tableCellAmount, { fontWeight: 'bold' }]}>
            {formatAmount(filteredBudgets.reduce((sum, b) => {
              const totalBudget = b.budget + (b.carriedOver || 0);
              return sum + (totalBudget - b.spent);
            }, 0), currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};

