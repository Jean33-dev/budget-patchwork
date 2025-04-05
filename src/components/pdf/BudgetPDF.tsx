
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#8B5CF6",
    borderBottomStyle: "solid",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1F2C",
  },
  date: {
    fontSize: 12,
    color: "#4A5568",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2D3748",
  },
  table: {
    display: "flex",
    width: "auto",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    borderBottomStyle: "solid",
    alignItems: "center",
    minHeight: 30,
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#F7FAFC",
    fontWeight: "bold",
  },
  tableCell: {
    width: "25%",
    padding: 5,
    fontSize: 10,
  },
  tableCellAmount: {
    width: "25%",
    padding: 5,
    fontSize: 10,
    textAlign: "right",
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F7FAFC",
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#718096",
  },
});

// Types de données
interface BudgetPDFProps {
  totalIncome: number;
  totalExpenses: number;
  budgets: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
  }>;
  incomes?: Array<{
    id: string;
    title: string;
    budget: number;
    type: "income";
  }>;
  expenses?: Array<{
    id: string;
    title: string;
    budget: number;
    type: "expense";
    date?: string;
  }>;
}

// Création du document PDF
const BudgetPDFDocument = ({ totalIncome, totalExpenses, budgets, incomes, expenses }: BudgetPDFProps) => {
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
  
  const balance = totalIncome - totalExpenses;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rapport Budgétaire</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

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

        {budgets && budgets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budgets</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Nom</Text>
                <Text style={styles.tableCellAmount}>Montant</Text>
                <Text style={styles.tableCellAmount}>Dépensé</Text>
                <Text style={styles.tableCellAmount}>Restant</Text>
              </View>
              {budgets.filter(b => b.type === "budget").map((budget) => (
                <View style={styles.tableRow} key={budget.id}>
                  <Text style={styles.tableCell}>{budget.title}</Text>
                  <Text style={styles.tableCellAmount}>{budget.budget.toFixed(2)} €</Text>
                  <Text style={styles.tableCellAmount}>{budget.spent.toFixed(2)} €</Text>
                  <Text style={styles.tableCellAmount}>{(budget.budget - budget.spent).toFixed(2)} €</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {incomes && incomes.length > 0 && (
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
                  <Text style={styles.tableCellAmount}>{income.budget.toFixed(2)} €</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {expenses && expenses.length > 0 && (
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
        )}

        <View style={styles.footer}>
          <Text>Généré le {formattedDate} • Budget App</Text>
        </View>
      </Page>
    </Document>
  );
};

interface BudgetPDFDownloadProps {
  fileName?: string;
  totalIncome: number;
  totalExpenses: number;
  budgets: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
  }>;
  incomes?: Array<{
    id: string;
    title: string;
    budget: number;
    type: "income";
  }>;
  expenses?: Array<{
    id: string;
    title: string;
    budget: number;
    type: "expense";
    date?: string;
  }>;
  className?: string;
  onClick?: () => void; // Added the onClick prop to fix the TypeScript error
}

export const BudgetPDFDownload = ({ 
  fileName = "rapport-budget.pdf",
  totalIncome,
  totalExpenses,
  budgets,
  incomes,
  expenses,
  className,
  onClick // Adding onClick as a prop
}: BudgetPDFDownloadProps) => {
  return (
    <PDFDownloadLink
      document={
        <BudgetPDFDocument 
          totalIncome={totalIncome} 
          totalExpenses={totalExpenses} 
          budgets={budgets}
          incomes={incomes}
          expenses={expenses}
        />
      }
      fileName={fileName}
      className={className}
      onClick={onClick} // Pass the onClick prop to PDFDownloadLink
    >
      {/* Fixed issue: Changed function component to ReactNode */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full flex items-center justify-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Télécharger PDF
      </Button>
    </PDFDownloadLink>
  );
};
