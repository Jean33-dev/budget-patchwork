
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { formatAmount } from "@/utils/format-amount";

interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  carriedOver?: number; // Added the carriedOver property
}

interface BudgetsSectionProps {
  budgets: Budget[];
  currency?: "EUR" | "USD" | "GBP";
}

export const BudgetsSection: React.FC<BudgetsSectionProps> = ({ budgets, currency = "EUR" }) => {
  const filteredBudgets = budgets.filter(b => b.type === "budget");
  
  if (!filteredBudgets.length) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Budgets</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Nom</Text>
          <Text style={styles.tableCellAmount}>Budget</Text>
          <Text style={styles.tableCellAmount}>Reporté</Text>
          <Text style={styles.tableCellAmount}>Dépensé</Text>
          <Text style={styles.tableCellAmount}>Restant</Text>
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
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Total</Text>
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
