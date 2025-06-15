
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { formatAmount } from "@/utils/format-amount";
import { translations } from "@/i18n/translations";

interface Expense {
  id: string;
  title: string;
  budget: number;
  type: "expense";
  date?: string;
}

interface ExpensesSectionProps {
  expenses?: Expense[];
  currency?: "EUR" | "USD" | "GBP";
  language?: string;
}

// Utilitaire pour traduction :
function getTranslation(language: string, key: string): string {
  if (translations[language] && translations[language][key]) {
    return translations[language][key];
  }
  if (translations["en"] && translations["en"][key]) {
    return translations["en"][key];
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[TRANSLATION MISSING] ${key} (${language})`);
  }
  return key;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  expenses,
  currency = "EUR",
  language = "fr"
}) => {
  if (!expenses || !expenses.length) return null;

  const t = (key: string) => getTranslation(language, key);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("pdf.expenses")}</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>{t("pdf.name")}</Text>
          <Text style={styles.tableCell}>{t("pdf.date")}</Text>
          <Text style={styles.tableCellAmount}>{t("pdf.amount")}</Text>
        </View>
        {expenses.map((expense) => (
          <View style={styles.tableRow} key={expense.id}>
            <Text style={styles.tableCell}>{expense.title}</Text>
            <Text style={styles.tableCell}>
              {expense.date ? new Date(expense.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US") : "N/A"}
            </Text>
            <Text style={styles.tableCellAmount}>{formatAmount(expense.budget, currency)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
