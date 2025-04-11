
import { ReactNode } from "react";
import { BlobProviderParams } from "@react-pdf/renderer";

export interface BudgetPDFProps {
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

export interface BudgetPDFDownloadProps {
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
  onClick?: () => void;
  children?: ReactNode;
}
