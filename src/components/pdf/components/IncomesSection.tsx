
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { formatAmount } from "@/utils/format-amount";
import { translations } from "@/i18n/translations";

interface Income {
  id: string;
  title: string;
  budget: number;
  type: "income";
}
interface IncomesSectionProps {
  incomes?: Income[];
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
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[TRANSLATION MISSING] ${key} (${language})`);
  }
  return key;
}

export const IncomesSection: React.FC<IncomesSectionProps> = ({
  incomes,
  currency = "EUR",
  language = "fr"
}) => {
  if (!incomes || !incomes.length) return null;

  const t = (key: string) => getTranslation(language, key);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("pdf.incomes")}</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>{t("pdf.source")}</Text>
          <Text style={styles.tableCellAmount}>{t("pdf.amount")}</Text>
        </View>
        {incomes.map((income) => (
          <View style={styles.tableRow} key={income.id}>
            <Text style={styles.tableCell}>{income.title}</Text>
            <Text style={styles.tableCellAmount}>{formatAmount(income.budget, currency)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
