
import { ReactNode } from "react";

export interface BudgetPDFProps {
  totalIncome: number;
  totalExpenses: number;
  budgets: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
    carriedOver?: number; // Added the carriedOver property
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
  currency?: "EUR" | "USD" | "GBP";
}

export interface BudgetPDFDownloadProps extends BudgetPDFProps {
  fileName?: string;
  className?: string;
  onClick?: () => void;
}
