
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

interface BudgetSummarySectionProps {
  totalIncome: number;
  totalExpenses: number;
}

export const BudgetSummarySection: React.FC<BudgetSummarySectionProps> = ({ 
  totalIncome, 
  totalExpenses 
}) => {
  const balance = totalIncome - totalExpenses;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Résumé</Text>
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Revenus totaux :</Text>
          <Text>{totalIncome.toFixed(2)} €</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Dépenses totales :</Text>
          <Text>{totalExpenses.toFixed(2)} €</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Balance :</Text>
          <Text style={{ color: balance >= 0 ? "#10B981" : "#EF4444" }}>
            {balance.toFixed(2)} €
          </Text>
        </View>
      </View>
    </View>
  );
};
