import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { formatAmount } from "@/utils/format-amount";

interface BudgetSummarySectionProps {
  totalIncome: number;
  totalExpenses: number;
  currency?: "EUR" | "USD" | "GBP";
}

export const BudgetSummarySection: React.FC<BudgetSummarySectionProps> = ({ 
  totalIncome, 
  totalExpenses, 
  currency = "EUR"
}) => {
  const balance = totalIncome - totalExpenses;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Résumé</Text>
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Revenus totaux :</Text>
          <Text>{formatAmount(totalIncome, currency)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Dépenses totales :</Text>
          <Text>{formatAmount(totalExpenses, currency)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Balance :</Text>
          <Text style={{ color: balance >= 0 ? "#10B981" : "#EF4444" }}>
            {formatAmount(balance, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};
