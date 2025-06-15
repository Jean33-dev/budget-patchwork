
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { formatAmount } from "@/utils/format-amount";
import { translations } from "@/i18n/translations";

interface BudgetSummarySectionProps {
  totalIncome: number;
  totalExpenses: number;
  currency?: "EUR" | "USD" | "GBP";
  language?: string;
}

function getTranslation(language: string, key: string): string {
  if (translations[language] && translations[language][key]) {
    return translations[language][key];
  }
  if (translations["en"] && translations["en"][key]) {
    return translations["en"][key];
  }
  // Log missing key for debug
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[TRANSLATION MISSING] ${key} (${language})`);
  }
  return key; // fallback
}

export const BudgetSummarySection: React.FC<BudgetSummarySectionProps> = ({ 
  totalIncome, 
  totalExpenses, 
  currency = "EUR",
  language = "fr"
}) => {
  const t = (key: string) => getTranslation(language, key);
  const balance = totalIncome - totalExpenses;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("pdf.summary")}</Text>
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>{t("pdf.totalIncome")} :</Text>
          <Text>{formatAmount(totalIncome, currency)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>{t("pdf.totalExpenses")} :</Text>
          <Text>{formatAmount(totalExpenses, currency)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>{t("pdf.balance")} :</Text>
          <Text style={{ color: balance >= 0 ? "#10B981" : "#EF4444" }}>
            {formatAmount(balance, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};
