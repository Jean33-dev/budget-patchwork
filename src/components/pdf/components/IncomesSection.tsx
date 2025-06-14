import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { formatAmount } from "@/utils/format-amount";

interface Income {
  id: string;
  title: string;
  budget: number;
  type: "income";
}

interface IncomesSectionProps {
  incomes?: Income[];
  currency?: "EUR" | "USD" | "GBP";
}

export const IncomesSection: React.FC<IncomesSectionProps> = ({ incomes, currency = "EUR" }) => {
  if (!incomes || !incomes.length) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Revenus</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Source</Text>
          <Text style={styles.tableCellAmount}>Montant</Text>
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
