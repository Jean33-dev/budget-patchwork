
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
}

interface BudgetsSectionProps {
  budgets: Budget[];
}

export const BudgetsSection: React.FC<BudgetsSectionProps> = ({ budgets }) => {
  const filteredBudgets = budgets.filter(b => b.type === "budget");
  
  if (!filteredBudgets.length) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Budgets</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Nom</Text>
          <Text style={styles.tableCellAmount}>Montant</Text>
          <Text style={styles.tableCellAmount}>Dépensé</Text>
          <Text style={styles.tableCellAmount}>Restant</Text>
        </View>
        {filteredBudgets.map((budget) => (
          <View style={styles.tableRow} key={budget.id}>
            <Text style={styles.tableCell}>{budget.title}</Text>
            <Text style={styles.tableCellAmount}>{budget.budget.toFixed(2)} €</Text>
            <Text style={styles.tableCellAmount}>{budget.spent.toFixed(2)} €</Text>
            <Text style={styles.tableCellAmount}>{(budget.budget - budget.spent).toFixed(2)} €</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
