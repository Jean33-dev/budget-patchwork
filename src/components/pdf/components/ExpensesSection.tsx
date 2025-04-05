
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

interface Expense {
  id: string;
  title: string;
  budget: number;
  type: "expense";
  date?: string;
}

interface ExpensesSectionProps {
  expenses?: Expense[];
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({ expenses }) => {
  if (!expenses || !expenses.length) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dépenses</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Nom</Text>
          <Text style={styles.tableCell}>Date</Text>
          <Text style={styles.tableCellAmount}>Montant</Text>
        </View>
        {expenses.map((expense) => (
          <View style={styles.tableRow} key={expense.id}>
            <Text style={styles.tableCell}>{expense.title}</Text>
            <Text style={styles.tableCell}>
              {expense.date ? new Date(expense.date).toLocaleDateString("fr-FR") : "N/A"}
            </Text>
            <Text style={styles.tableCellAmount}>{expense.budget.toFixed(2)} €</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
