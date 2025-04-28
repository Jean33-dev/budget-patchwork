
import { StyleSheet } from "@react-pdf/renderer";

// PDF Document Styles
export const styles = StyleSheet.create({
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
    width: "20%", // Changed from 25% to 20% to accommodate 5 columns
    padding: 5,
    fontSize: 10,
  },
  tableCellAmount: {
    width: "20%", // Changed from 25% to 20% to accommodate 5 columns
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
